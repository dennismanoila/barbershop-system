import { Router } from "express";
import {
  confirmAppointmentHandler,
  createAppointmentHandler,
  getAppointmentsHandler,
  getAvailabilityHandler,
} from "../controllers/appointmentController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/appointments", authMiddleware, createAppointmentHandler);
router.get("/appointments", authMiddleware, getAppointmentsHandler);
router.get("/availability", getAvailabilityHandler);
router.patch(
  "/appointments/:id/confirm",
  authMiddleware,
  confirmAppointmentHandler,
);
export default router;
