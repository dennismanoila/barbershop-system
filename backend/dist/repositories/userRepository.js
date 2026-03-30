"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findBarbers = exports.findUserByEmail = exports.createUser = void 0;
const prisma_1 = require("../lib/prisma");
const createUser = async (data) => {
    return prisma_1.prisma.user.create({
        data,
    });
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
        where: {
            role: "BARBER",
        },
        select: {
            id: true,
            email: true,
        },
    });
};
exports.findBarbers = findBarbers;
