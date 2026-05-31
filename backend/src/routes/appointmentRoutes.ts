import { Router } from "express";
import {
  cancelAppointmentHandler,
  confirmAppointmentHandler,
  createAppointmentHandler,
  getAppointmentsHandler,
  getAvailabilityHandler,
  getBarberCalendarHandler,
  getBarberPendingHandler,
} from "../controllers/appointmentController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { requireRole } from "../middlewares/roleMiddleware";

const router = Router();

router.post("/appointments", authMiddleware, createAppointmentHandler);
router.get("/appointments", authMiddleware, getAppointmentsHandler);
router.get("/availability", getAvailabilityHandler);
router.patch("/appointments/:id/confirm", authMiddleware, confirmAppointmentHandler);
router.patch("/appointments/:id/cancel", authMiddleware, cancelAppointmentHandler);
router.get("/barber/calendar", authMiddleware, requireRole("BARBER"), getBarberCalendarHandler);
router.get("/barber/pending", authMiddleware, requireRole("BARBER"), getBarberPendingHandler);

export default router;
