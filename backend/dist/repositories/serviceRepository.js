"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteService = exports.createService = exports.findAllServices = void 0;
const prisma_1 = require("../lib/prisma");
const findAllServices = async () => {
    return prisma_1.prisma.service.findMany();
};
exports.findAllServices = findAllServices;
const createService = async (data) => {
    return prisma_1.prisma.service.create({ data });
};
exports.createService = createService;
const deleteService = async (id) => {
    return prisma_1.prisma.service.delete({ where: { id } });
};
exports.deleteService = deleteService;
