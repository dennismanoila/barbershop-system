import { findAllServices } from "../repositories/serviceRepository";
import { createService } from "../repositories/serviceRepository";

export const getAllServices = async () => {
  return findAllServices();
};

export const addService = async (data: {
  name: string;
  durationMinutes: number;
  price: number;
}) => {
  return createService(data);
};
