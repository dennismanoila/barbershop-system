"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmAppointmentHandler = exports.getAvailabilityHandler = exports.getAppointmentsHandler = exports.createAppointmentHandler = void 0;
const appointmentService_1 = require("../services/appointmentService");
const appointmentRepository_1 = require("../repositories/appointmentRepository");
const createAppointmentHandler = async (req, res) => {
    const userId = req.user.userId;
    const { serviceId, date, barberId } = req.body;
    console.log("CREATE APPOINTMENT -> user from token:", req.user);
    console.log("CREATE APPOINTMENT -> userId:", userId);
    console.log("CREATE APPOINTMENT -> body:", req.body);
    if (!serviceId || !date) {
        return res.status(400).json({
            message: "Missing fields",
        });
    }
    const appointment = await (0, appointmentService_1.bookAppointment)(userId, serviceId, new Date(date), barberId);
    res.status(201).json(appointment);
};
exports.createAppointmentHandler = createAppointmentHandler;
const getAppointmentsHandler = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user.userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (user.role === "BARBER") {
            const appointments = await (0, appointmentRepository_1.findAppointmentsByBarber)(user.userId);
            return res.json(appointments);
        }
        const appointments = await (0, appointmentService_1.getUserAppointments)(user.userId);
        return res.json(appointments);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
};
exports.getAppointmentsHandler = getAppointmentsHandler;
const getAvailabilityHandler = async (req, res) => {
    const { date } = req.query;
    if (!date) {
        return res.status(400).json({
            message: "Date is required",
        });
    }
    const result = await (0, appointmentService_1.getAvailability)(new Date(date));
    res.json(result);
};
exports.getAvailabilityHandler = getAvailabilityHandler;
const confirmAppointmentHandler = async (req, res) => {
    const user = req.user;
    const { id } = req.params;
    if (user.role !== "BARBER" && user.role !== "ADMIN") {
        return res.status(403).json({ message: "Forbidden" });
    }
    const appointment = await (0, appointmentService_1.confirmAppointmentService)(Number(id));
    res.json(appointment);
};
exports.confirmAppointmentHandler = confirmAppointmentHandler;
