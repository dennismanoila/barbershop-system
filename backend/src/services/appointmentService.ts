import { findBarbers } from "../repositories/userRepository";
import {
  cancelAppointment,
  confirmAppointment,
  createAppointment,
  expireOldPending,
  findAppointmentById,
  findAppointmentsByDate,
  findAppointmentsByUser,
  findBarberAppointmentsOnDay,
  findBarberCalendarDay,
  findBarberPending,
  findUserAppointmentsOnDay,
} from "../repositories/appointmentRepository";
import { prisma } from "../lib/prisma";
import { checkHoliday } from "../utils/holidays";

const hasOverlap = (
  appointments: Array<{ date: Date; service: { durationMinutes: number } }>,
  newStart: Date,
  newDurationMinutes: number,
) => {
  const newEnd = new Date(newStart.getTime() + newDurationMinutes * 60 * 1000);
  return appointments.some((appointment) => {
    const appointmentStart = new Date(appointment.date);
    const appointmentEnd = new Date(
      appointmentStart.getTime() + appointment.service.durationMinutes * 60 * 1000,
    );
    return appointmentStart < newEnd && appointmentEnd > newStart;
  });
};

export const bookAppointment = async (
  userId: number,
  serviceId: number,
  date: Date,
  barberId?: number,
) => {
  const minutes = date.getMinutes();

  if (minutes !== 0 && minutes !== 30) {
    throw new Error("Appointments must be at :00 or :30");
  }

  const { isHoliday, name: holidayName } = await checkHoliday(date);
  if (isHoliday) throw new Error(`Bookings are unavailable on ${holidayName}`);

  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service) throw new Error("Service not found");

  const userExisting = await findUserAppointmentsOnDay(userId, date);
  if (hasOverlap(userExisting, date, service.durationMinutes)) {
    throw new Error("You already have an appointment at this time");
  }

  let assignedBarberId = barberId;

  if (barberId) {
    const existing = await findBarberAppointmentsOnDay(barberId, date);
    if (hasOverlap(existing, date, service.durationMinutes)) {
      throw new Error("Selected barber is not available");
    }
  } else {
    const barbers = await findBarbers();

    for (const barber of barbers) {
      const existing = await findBarberAppointmentsOnDay(barber.id, date);
      if (!hasOverlap(existing, date, service.durationMinutes)) {
        assignedBarberId = barber.id;
        break;
      }
    }

    if (!assignedBarberId) {
      throw new Error("No barbers available at this time");
    }
  }

  return createAppointment({
    userId,
    serviceId,
    date,
    barberId: assignedBarberId as number,
  });
};

export const getUserAppointments = async (userId: number) => {
  return findAppointmentsByUser(userId);
};

export const getAvailability = async (date: Date, barberId?: number) => {
  await expireOldPending();
  const { isHoliday, name: holidayName } = await checkHoliday(date);
  if (isHoliday) {
    return { holiday: true, holidayName, slots: [] };
  }

  const appointments = await findAppointmentsByDate(date);
  const SLOT_MS = 30 * 60 * 1000;
  const slots = [];

  if (barberId) {
    for (let hour = 9; hour < 17; hour++) {
      for (const minutes of [0, 30]) {
        const slotStart = new Date(date);
        slotStart.setHours(hour, minutes, 0, 0);
        const slotEnd = new Date(slotStart.getTime() + SLOT_MS);

        const conflict = appointments.find((a) => {
          if (a.barberId !== barberId) return false;
          const appointmentStart = new Date(a.date);
          const appointmentEnd = new Date(
            appointmentStart.getTime() + a.service.durationMinutes * 60 * 1000,
          );
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
  } else {
    const barbers = await findBarbers();

    for (let hour = 9; hour < 17; hour++) {
      for (const minutes of [0, 30]) {
        const slotStart = new Date(date);
        slotStart.setHours(hour, minutes, 0, 0);
        const slotEnd = new Date(slotStart.getTime() + SLOT_MS);

        let availableBarbers = 0;

        for (const barber of barbers) {
          const conflict = appointments.find((a) => {
            if (a.barberId !== barber.id) return false;
            const appointmentStart = new Date(a.date);
            const appointmentEnd = new Date(
              appointmentStart.getTime() + a.service.durationMinutes * 60 * 1000,
            );
            return appointmentStart < slotEnd && appointmentEnd > slotStart;
          });

          if (!conflict) availableBarbers++;
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

export const getBarberCalendar = async (barberId: number, date: Date) => {
  await expireOldPending();
  return findBarberCalendarDay(barberId, date);
};

export const getBarberPendingAppointments = async (barberId: number) => {
  await expireOldPending();
  return findBarberPending(barberId);
};

export const confirmAppointmentService = async (id: number) => {
  return confirmAppointment(id);
};

export const cancelAppointmentService = async (
  id: number,
  userId: number,
  role: string,
) => {
  const appointment = await findAppointmentById(id);
  if (!appointment) throw new Error("Appointment not found");

  if (appointment.status === "CANCELLED" || appointment.status === "EXPIRED") {
    throw new Error("Appointment is already closed");
  }

  if (role === "CLIENT") {
    if (appointment.userId !== userId) throw new Error("Forbidden");
    if (appointment.status !== "PENDING") {
      throw new Error("Only pending appointments can be cancelled");
    }
  } else if (role === "BARBER") {
    if (appointment.barberId !== userId) throw new Error("Forbidden");
  }

  return cancelAppointment(id);
};
