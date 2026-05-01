import { prisma } from "../lib/prisma";

export const createAppointment = async (data: {
  userId: number;
  serviceId: number;
  date: Date;
  barberId: number;
}) => {
  return prisma.appointment.create({
    data,
  });
};

export const findAppointmentsByBarber = async (barberId: number) => {
  return prisma.appointment.findMany({
    where: { barberId },
    include: {
      service: true,
      user: {
        select: {
          id: true,
          email: true,
        },
      },
    },
    orderBy: {
      date: "asc",
    },
  });
};

export const findAppointmentsByUser = async (userId: number) => {
  return prisma.appointment.findMany({
    where: { userId },
    include: {
      service: true,
    },
    orderBy: {
      date: "asc",
    },
  });
};

export const findConflict = async (serviceId: number, date: Date) => {
  return prisma.appointment.findFirst({
    where: {
      serviceId,
      date,
    },
  });
};

export const findConflictsForBarber = async (barberId: number, date: Date) => {
  return prisma.appointment.findFirst({
    where: {
      barberId,
      date,
    },
  });
};

export const findAppointmentsByDate = async (date: Date) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  return prisma.appointment.findMany({
    where: {
      date: {
        gte: start,
        lte: end,
      },
    },
    include: { service: true },
  });
};

export const findBarberAppointmentsOnDay = async (
  barberId: number,
  date: Date,
) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  return prisma.appointment.findMany({
    where: {
      barberId,
      date: { gte: start, lte: end },
    },
    include: { service: true },
  });
};

export const confirmAppointment = async (id: number) => {
  return prisma.appointment.update({
    where: { id },
    data: { status: "CONFIRMED" },
  });
};
