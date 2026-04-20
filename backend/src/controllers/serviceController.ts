import { Request, Response } from "express";
import { getAllServices } from "../services/serviceService";
import { addService } from "../services/serviceService";

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
