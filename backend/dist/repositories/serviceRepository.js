"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createService = exports.findAllServices = void 0;
const prisma_1 = require("../lib/prisma");
const findAllServices = async () => {
    return prisma_1.prisma.service.findMany();
};
exports.findAllServices = findAllServices;
const createService = async (data) => {
    return prisma_1.prisma.service.create({
        data,
    });
};
exports.createService = createService;
