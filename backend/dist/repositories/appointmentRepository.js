"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAppointmentById = exports.cancelAppointment = exports.confirmAppointment = exports.findBarberPending = exports.findBarberCalendarDay = exports.findBarberAppointmentsOnDay = exports.findUserAppointmentsOnDay = exports.findAppointmentsByDate = exports.expireOldPending = exports.findConflictsForBarber = exports.findConflict = exports.findAppointmentsByUser = exports.findAppointmentsByBarber = exports.createAppointment = void 0;
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
                select: { id: true, email: true, firstName: true, lastName: true },
            },
        },
        orderBy: { date: "asc" },
    });
};
exports.findAppointmentsByBarber = findAppointmentsByBarber;
const findAppointmentsByUser = async (userId) => {
    return prisma_1.prisma.appointment.findMany({
        where: { userId },
        include: {
            service: true,
            barber: {
                select: { id: true, email: true, firstName: true, lastName: true },
            },
        },
        orderBy: { date: "asc" },
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
const ACTIVE_STATUSES = { notIn: ["EXPIRED", "CANCELLED"] };
const expireOldPending = async () => {
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
    await prisma_1.prisma.appointment.updateMany({
        where: { status: "PENDING", createdAt: { lt: cutoff } },
        data: { status: "EXPIRED" },
    });
};
exports.expireOldPending = expireOldPending;
const findAppointmentsByDate = async (date) => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    return prisma_1.prisma.appointment.findMany({
        where: {
            date: { gte: start, lte: end },
            status: ACTIVE_STATUSES,
        },
        include: { service: true },
    });
};
exports.findAppointmentsByDate = findAppointmentsByDate;
const findUserAppointmentsOnDay = async (userId, date) => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    return prisma_1.prisma.appointment.findMany({
        where: {
            userId,
            date: { gte: start, lte: end },
            status: ACTIVE_STATUSES,
        },
        include: { service: true },
    });
};
exports.findUserAppointmentsOnDay = findUserAppointmentsOnDay;
const findBarberAppointmentsOnDay = async (barberId, date) => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    return prisma_1.prisma.appointment.findMany({
        where: {
            barberId,
            date: { gte: start, lte: end },
            status: ACTIVE_STATUSES,
        },
        include: { service: true },
    });
};
exports.findBarberAppointmentsOnDay = findBarberAppointmentsOnDay;
const findBarberCalendarDay = async (barberId, date) => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    return prisma_1.prisma.appointment.findMany({
        where: {
            barberId,
            date: { gte: start, lte: end },
            status: ACTIVE_STATUSES,
        },
        include: {
            service: true,
            user: { select: { id: true, email: true, firstName: true, lastName: true } },
        },
        orderBy: { date: "asc" },
    });
};
exports.findBarberCalendarDay = findBarberCalendarDay;
const findBarberPending = async (barberId) => {
    return prisma_1.prisma.appointment.findMany({
        where: { barberId, status: "PENDING" },
        include: {
            service: true,
            user: { select: { id: true, email: true, firstName: true, lastName: true } },
        },
        orderBy: { date: "asc" },
    });
};
exports.findBarberPending = findBarberPending;
const confirmAppointment = async (id) => {
    return prisma_1.prisma.appointment.update({
        where: { id },
        data: { status: "CONFIRMED" },
    });
};
exports.confirmAppointment = confirmAppointment;
const cancelAppointment = async (id) => {
    return prisma_1.prisma.appointment.update({
        where: { id },
        data: { status: "CANCELLED" },
    });
};
exports.cancelAppointment = cancelAppointment;
const findAppointmentById = async (id) => {
    return prisma_1.prisma.appointment.findUnique({ where: { id } });
};
exports.findAppointmentById = findAppointmentById;
