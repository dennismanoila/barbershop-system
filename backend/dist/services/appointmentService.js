"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelAppointmentService = exports.confirmAppointmentService = exports.getBarberPendingAppointments = exports.getBarberCalendar = exports.getAvailability = exports.getUserAppointments = exports.bookAppointment = void 0;
const userRepository_1 = require("../repositories/userRepository");
const appointmentRepository_1 = require("../repositories/appointmentRepository");
const prisma_1 = require("../lib/prisma");
const holidays_1 = require("../utils/holidays");
const hasOverlap = (appointments, newStart, newDurationMinutes) => {
    const newEnd = new Date(newStart.getTime() + newDurationMinutes * 60 * 1000);
    return appointments.some((appointment) => {
        const appointmentStart = new Date(appointment.date);
        const appointmentEnd = new Date(appointmentStart.getTime() + appointment.service.durationMinutes * 60 * 1000);
        return appointmentStart < newEnd && appointmentEnd > newStart;
    });
};
const bookAppointment = async (userId, serviceId, date, barberId) => {
    const minutes = date.getMinutes();
    if (minutes !== 0 && minutes !== 30) {
        throw new Error("Appointments must be at :00 or :30");
    }
    const { isHoliday, name: holidayName } = await (0, holidays_1.checkHoliday)(date);
    if (isHoliday)
        throw new Error(`Bookings are unavailable on ${holidayName}`);
    const service = await prisma_1.prisma.service.findUnique({ where: { id: serviceId } });
    if (!service)
        throw new Error("Service not found");
    const userExisting = await (0, appointmentRepository_1.findUserAppointmentsOnDay)(userId, date);
    if (hasOverlap(userExisting, date, service.durationMinutes)) {
        throw new Error("You already have an appointment at this time");
    }
    let assignedBarberId = barberId;
    if (barberId) {
        const existing = await (0, appointmentRepository_1.findBarberAppointmentsOnDay)(barberId, date);
        if (hasOverlap(existing, date, service.durationMinutes)) {
            throw new Error("Selected barber is not available");
        }
    }
    else {
        const barbers = await (0, userRepository_1.findBarbers)();
        for (const barber of barbers) {
            const existing = await (0, appointmentRepository_1.findBarberAppointmentsOnDay)(barber.id, date);
            if (!hasOverlap(existing, date, service.durationMinutes)) {
                assignedBarberId = barber.id;
                break;
            }
        }
        if (!assignedBarberId) {
            throw new Error("No barbers available at this time");
        }
    }
    return (0, appointmentRepository_1.createAppointment)({
        userId,
        serviceId,
        date,
        barberId: assignedBarberId,
    });
};
exports.bookAppointment = bookAppointment;
const getUserAppointments = async (userId) => {
    return (0, appointmentRepository_1.findAppointmentsByUser)(userId);
};
exports.getUserAppointments = getUserAppointments;
const getAvailability = async (date, barberId) => {
    await (0, appointmentRepository_1.expireOldPending)();
    const { isHoliday, name: holidayName } = await (0, holidays_1.checkHoliday)(date);
    if (isHoliday) {
        return { holiday: true, holidayName, slots: [] };
    }
    const appointments = await (0, appointmentRepository_1.findAppointmentsByDate)(date);
    const SLOT_MS = 30 * 60 * 1000;
    const slots = [];
    if (barberId) {
        for (let hour = 9; hour < 17; hour++) {
            for (const minutes of [0, 30]) {
                const slotStart = new Date(date);
                slotStart.setHours(hour, minutes, 0, 0);
                const slotEnd = new Date(slotStart.getTime() + SLOT_MS);
                const conflict = appointments.find((a) => {
                    if (a.barberId !== barberId)
                        return false;
                    const appointmentStart = new Date(a.date);
                    const appointmentEnd = new Date(appointmentStart.getTime() + a.service.durationMinutes * 60 * 1000);
                    return appointmentStart < slotEnd && appointmentEnd > slotStart;
                });
                slots.push({
                    time: `${hour}:${minutes === 0 ? "00" : "30"}`,
                    available: !conflict,
                    availableBarbers: conflict ? 0 : 1,
                    totalBarbers: 1,
                });
            }
        }
    }
    else {
        const barbers = await (0, userRepository_1.findBarbers)();
        for (let hour = 9; hour < 17; hour++) {
            for (const minutes of [0, 30]) {
                const slotStart = new Date(date);
                slotStart.setHours(hour, minutes, 0, 0);
                const slotEnd = new Date(slotStart.getTime() + SLOT_MS);
                let availableBarbers = 0;
                for (const barber of barbers) {
                    const conflict = appointments.find((a) => {
                        if (a.barberId !== barber.id)
                            return false;
                        const appointmentStart = new Date(a.date);
                        const appointmentEnd = new Date(appointmentStart.getTime() + a.service.durationMinutes * 60 * 1000);
                        return appointmentStart < slotEnd && appointmentEnd > slotStart;
                    });
                    if (!conflict)
                        availableBarbers++;
                }
                slots.push({
                    time: `${hour}:${minutes === 0 ? "00" : "30"}`,
                    available: availableBarbers > 0,
                    availableBarbers,
                    totalBarbers: barbers.length,
                });
            }
        }
    }
    return { holiday: false, holidayName: null, slots };
};
exports.getAvailability = getAvailability;
const getBarberCalendar = async (barberId, date) => {
    await (0, appointmentRepository_1.expireOldPending)();
    return (0, appointmentRepository_1.findBarberCalendarDay)(barberId, date);
};
exports.getBarberCalendar = getBarberCalendar;
const getBarberPendingAppointments = async (barberId) => {
    await (0, appointmentRepository_1.expireOldPending)();
    return (0, appointmentRepository_1.findBarberPending)(barberId);
};
exports.getBarberPendingAppointments = getBarberPendingAppointments;
const confirmAppointmentService = async (id) => {
    return (0, appointmentRepository_1.confirmAppointment)(id);
};
exports.confirmAppointmentService = confirmAppointmentService;
const cancelAppointmentService = async (id, userId, role) => {
    const appointment = await (0, appointmentRepository_1.findAppointmentById)(id);
    if (!appointment)
        throw new Error("Appointment not found");
    if (appointment.status === "CANCELLED" || appointment.status === "EXPIRED") {
        throw new Error("Appointment is already closed");
    }
    if (role === "CLIENT") {
        if (appointment.userId !== userId)
            throw new Error("Forbidden");
        if (appointment.status !== "PENDING") {
            throw new Error("Only pending appointments can be cancelled");
        }
    }
    else if (role === "BARBER") {
        if (appointment.barberId !== userId)
            throw new Error("Forbidden");
    }
    return (0, appointmentRepository_1.cancelAppointment)(id);
};
exports.cancelAppointmentService = cancelAppointmentService;
