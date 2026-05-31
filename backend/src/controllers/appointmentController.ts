import { Request, Response } from "express";
import {
  bookAppointment,
  cancelAppointmentService,
  confirmAppointmentService,
  getAvailability,
  getBarberCalendar,
  getBarberPendingAppointments,
  getUserAppointments,
} from "../services/appointmentService";
import { findAppointmentsByBarber } from "../repositories/appointmentRepository";

export const createAppointmentHandler = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const { serviceId, date, barberId } = req.body;

  console.log("CREATE APPOINTMENT -> user from token:", (req as any).user);
  console.log("CREATE APPOINTMENT -> userId:", userId);
  console.log("CREATE APPOINTMENT -> body:", req.body);

  if (!serviceId || !date) {
    return res.status(400).json({
      message: "Missing fields",
    });
  }

  const appointment = await bookAppointment(
    userId,
    serviceId,
    new Date(date),
    barberId,
  );

  res.status(201).json(appointment);
};

export const getAppointmentsHandler = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    if (!user || !user.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (user.role === "BARBER") {
      const appointments = await findAppointmentsByBarber(user.userId);
      return res.json(appointments);
    }

    const appointments = await getUserAppointments(user.userId);
    return res.json(appointments);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getAvailabilityHandler = async (req: Request, res: Response) => {
  const { date, barberId } = req.query;

  if (!date) {
    return res.status(400).json({
      message: "Date is required",
    });
  }

  const parsedBarberId = barberId ? Number(barberId) : undefined;
  const result = await getAvailability(new Date(date as string), parsedBarberId);

  res.json(result);
};

export const getBarberCalendarHandler = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { date } = req.query;

  if (!date) return res.status(400).json({ message: "Date is required" });

  const appointments = await getBarberCalendar(
    user.userId,
    new Date(date as string),
  );
  res.json(appointments);
};

export const getBarberPendingHandler = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const appointments = await getBarberPendingAppointments(user.userId);
  res.json(appointments);
};

export const confirmAppointmentHandler = async (
  req: Request,
  res: Response,
) => {
  const user = (req as any).user;
  const { id } = req.params;

  if (user.role !== "BARBER" && user.role !== "ADMIN") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const appointment = await confirmAppointmentService(Number(id));

  res.json(appointment);
};

export const cancelAppointmentHandler = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { id } = req.params;

  try {
    const appointment = await cancelAppointmentService(Number(id), user.userId, user.role);
    res.json(appointment);
  } catch (err: any) {
    if (err.message === "Forbidden") return res.status(403).json({ message: "Forbidden" });
    if (err.message === "Appointment not found") return res.status(404).json({ message: err.message });
    res.status(400).json({ message: err.message });
  }
};
