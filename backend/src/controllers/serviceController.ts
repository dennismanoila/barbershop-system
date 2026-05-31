import { Request, Response } from "express";
import { addService, getAllServices, removeService } from "../services/serviceService";

export const getServices = async (req: Request, res: Response) => {
  const services = await getAllServices();

  res.json(services);
};

export const createServiceHandler = async (req: Request, res: Response) => {
  const { name, durationMinutes, price } = req.body;

  if (
    name === undefined ||
    durationMinutes === undefined ||
    price === undefined
  ) {
    return res.status(400).json({
      message: "Missing required fields",
    });
  }

  if (
    typeof name !== "string" ||
    typeof durationMinutes !== "number" ||
    typeof price !== "number"
  ) {
    return res.status(400).json({
      message: "Invalid data types",
    });
  }

  const newService = await addService({
    name,
    durationMinutes,
    price,
  });

  res.status(201).json(newService);
};

export const deleteServiceHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await removeService(Number(id));
    res.status(204).send();
  } catch {
    res.status(400).json({ message: "Cannot delete service with existing appointments" });
  }
};
