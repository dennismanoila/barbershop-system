"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmAppointmentService = exports.getAvailability = exports.getUserAppointments = exports.bookAppointment = void 0;
const userRepository_1 = require("../repositories/userRepository");
const appointmentRepository_1 = require("../repositories/appointmentRepository");
const bookAppointment = async (userId, serviceId, date, barberId) => {
    const minutes = date.getMinutes();
    if (minutes !== 0 && minutes !== 30) {
        throw new Error("Appointments must be at :00 or :30");
    }
    let assignedBarberId = barberId;
    if (barberId) {
        const conflict = await (0, appointmentRepository_1.findConflictsForBarber)(barberId, date);
        if (conflict) {
            throw new Error("Selected barber is not available");
        }
    }
    else {
        const barbers = await (0, userRepository_1.findBarbers)();
        for (const barber of barbers) {
            const conflict = await (0, appointmentRepository_1.findConflictsForBarber)(barber.id, date);
            if (!conflict) {
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
const getAvailability = async (date) => {
    const barbers = await (0, userRepository_1.findBarbers)();
    const appointments = await (0, appointmentRepository_1.findAppointmentsByDate)(date);
    const slots = [];
    for (let hour = 9; hour < 17; hour++) {
        for (let minutes of [0, 30]) {
            const slotDate = new Date(date);
            slotDate.setHours(hour, minutes, 0, 0);
            let availableBarbers = 0;
            for (const barber of barbers) {
                const conflict = appointments.find((a) => a.barberId === barber.id &&
                    new Date(a.date).getTime() === slotDate.getTime());
                if (!conflict) {
                    availableBarbers++;
                }
            }
            slots.push({
                time: `${hour}:${minutes === 0 ? "00" : "30"}`,
                availableBarbers,
                totalBarbers: barbers.length,
            });
        }
    }
    return slots;
};
exports.getAvailability = getAvailability;
const confirmAppointmentService = async (id) => {
    return (0, appointmentRepository_1.confirmAppointment)(id);
};
exports.confirmAppointmentService = confirmAppointmentService;
