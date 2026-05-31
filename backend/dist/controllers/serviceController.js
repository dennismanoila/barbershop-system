"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteServiceHandler = exports.createServiceHandler = exports.getServices = void 0;
const serviceService_1 = require("../services/serviceService");
const getServices = async (req, res) => {
    const services = await (0, serviceService_1.getAllServices)();
    res.json(services);
};
exports.getServices = getServices;
const createServiceHandler = async (req, res) => {
    const { name, durationMinutes, price } = req.body;
    if (name === undefined ||
        durationMinutes === undefined ||
        price === undefined) {
        return res.status(400).json({
            message: "Missing required fields",
        });
    }
    if (typeof name !== "string" ||
        typeof durationMinutes !== "number" ||
        typeof price !== "number") {
        return res.status(400).json({
            message: "Invalid data types",
        });
    }
    const newService = await (0, serviceService_1.addService)({
        name,
        durationMinutes,
        price,
    });
    res.status(201).json(newService);
};
exports.createServiceHandler = createServiceHandler;
const deleteServiceHandler = async (req, res) => {
    const { id } = req.params;
    try {
        await (0, serviceService_1.removeService)(Number(id));
        res.status(204).send();
    }
    catch {
        res.status(400).json({ message: "Cannot delete service with existing appointments" });
    }
};
exports.deleteServiceHandler = deleteServiceHandler;
