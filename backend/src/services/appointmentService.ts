import { findBarbers } from "../repositories/userRepository";
import {
  confirmAppointment,
  createAppointment,
  findAppointmentsByDate,
  findAppointmentsByUser,
  findConflictsForBarber,
} from "../repositories/appointmentRepository";

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

  let assignedBarberId = barberId;

  if (barberId) {
    const conflict = await findConflictsForBarber(barberId, date);

    if (conflict) {
      throw new Error("Selected barber is not available");
    }
  } else {
    const barbers = await findBarbers();

    for (const barber of barbers) {
      const conflict = await findConflictsForBarber(barber.id, date);

      if (!conflict) {
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

export const getAvailability = async (date: Date) => {
  const barbers = await findBarbers();
  const appointments = await findAppointmentsByDate(date);

  const slots = [];

  for (let hour = 9; hour < 17; hour++) {
    for (let minutes of [0, 30]) {
      const slotDate = new Date(date);
      slotDate.setHours(hour, minutes, 0, 0);

      let availableBarbers = 0;

      for (const barber of barbers) {
        const conflict = appointments.find(
          (a) =>
            a.barberId === barber.id &&
            new Date(a.date).getTime() === slotDate.getTime(),
        );

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

export const confirmAppointmentService = async (id: number) => {
  return confirmAppointment(id);
};
