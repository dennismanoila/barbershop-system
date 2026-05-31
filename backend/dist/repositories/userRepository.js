"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserBanned = exports.updateUserRole = exports.updateUserName = exports.findUserById = exports.findAllUsers = exports.findBarbers = exports.findUserByEmail = exports.createUser = void 0;
const prisma_1 = require("../lib/prisma");
const createUser = async (data) => {
    return prisma_1.prisma.user.create({ data });
};
exports.createUser = createUser;
const findUserByEmail = async (email) => {
    return prisma_1.prisma.user.findUnique({
        where: { email },
    });
};
exports.findUserByEmail = findUserByEmail;
const findBarbers = async () => {
    return prisma_1.prisma.user.findMany({
        where: { role: "BARBER" },
        select: { id: true, email: true, firstName: true, lastName: true },
    });
};
exports.findBarbers = findBarbers;
const findAllUsers = async () => {
    return prisma_1.prisma.user.findMany({
        select: { id: true, email: true, firstName: true, lastName: true, role: true, banned: true, createdAt: true },
        orderBy: { createdAt: "asc" },
    });
};
exports.findAllUsers = findAllUsers;
const findUserById = async (id) => {
    return prisma_1.prisma.user.findUnique({
        where: { id },
        select: { id: true, email: true, firstName: true, lastName: true, role: true },
    });
};
exports.findUserById = findUserById;
const updateUserName = async (id, firstName, lastName) => {
    return prisma_1.prisma.user.update({
        where: { id },
        data: { firstName, lastName },
        select: { id: true, email: true, firstName: true, lastName: true, role: true },
    });
};
exports.updateUserName = updateUserName;
const updateUserRole = async (id, role) => {
    return prisma_1.prisma.user.update({ where: { id }, data: { role } });
};
exports.updateUserRole = updateUserRole;
const updateUserBanned = async (id, banned) => {
    return prisma_1.prisma.user.update({ where: { id }, data: { banned } });
};
exports.updateUserBanned = updateUserBanned;
