"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeService = exports.addService = exports.getAllServices = void 0;
const serviceRepository_1 = require("../repositories/serviceRepository");
const getAllServices = async () => {
    return (0, serviceRepository_1.findAllServices)();
};
exports.getAllServices = getAllServices;
const addService = async (data) => {
    return (0, serviceRepository_1.createService)(data);
};
exports.addService = addService;
const removeService = async (id) => {
    return (0, serviceRepository_1.deleteService)(id);
};
exports.removeService = removeService;
