"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmAppointment = exports.findBarberAppointmentsOnDay = exports.findAppointmentsByDate = exports.findConflictsForBarber = exports.findConflict = exports.findAppointmentsByUser = exports.findAppointmentsByBarber = exports.createAppointment = void 0;
const prisma_1 = require("../lib/prisma");
const createAppointment = async (data) => {
    return prisma_1.prisma.appointment.create({
        data,
    });
};
exports.createAppointment = createAppointment;
const findAppointmentsByBarber = async (barberId) => {
    return prisma_1.prisma.appointment.findMany({
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
exports.findAppointmentsByBarber = findAppointmentsByBarber;
const findAppointmentsByUser = async (userId) => {
    return prisma_1.prisma.appointment.findMany({
        where: { userId },
        include: {
            service: true,
        },
        orderBy: {
            date: "asc",
        },
    });
};
exports.findAppointmentsByUser = findAppointmentsByUser;
const findConflict = async (serviceId, date) => {
    return prisma_1.prisma.appointment.findFirst({
        where: {
            serviceId,
            date,
        },
    });
};
exports.findConflict = findConflict;
const findConflictsForBarber = async (barberId, date) => {
    return prisma_1.prisma.appointment.findFirst({
        where: {
            barberId,
            date,
        },
    });
};
exports.findConflictsForBarber = findConflictsForBarber;
const findAppointmentsByDate = async (date) => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    return prisma_1.prisma.appointment.findMany({
        where: {
            date: {
                gte: start,
                lte: end,
            },
        },
        include: { service: true },
    });
};
exports.findAppointmentsByDate = findAppointmentsByDate;
const findBarberAppointmentsOnDay = async (barberId, date) => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    return prisma_1.prisma.appointment.findMany({
        where: {
            barberId,
            date: { gte: start, lte: end },
        },
        include: { service: true },
    });
};
exports.findBarberAppointmentsOnDay = findBarberAppointmentsOnDay;
const confirmAppointment = async (id) => {
    return prisma_1.prisma.appointment.update({
        where: { id },
        data: { status: "CONFIRMED" },
    });
};
exports.confirmAppointment = confirmAppointment;
