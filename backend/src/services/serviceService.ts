import { createService, deleteService, findAllServices } from "../repositories/serviceRepository";

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

export const removeService = async (id: number) => {
  return deleteService(id);
};
