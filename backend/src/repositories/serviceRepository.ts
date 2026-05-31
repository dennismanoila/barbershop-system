import { prisma } from "../lib/prisma";

export const findAllServices = async () => {
  return prisma.service.findMany();
};

export const createService = async (data: {
  name: string;
  durationMinutes: number;
  price: number;
}) => {
  return prisma.service.create({ data });
};

export const deleteService = async (id: number) => {
  return prisma.service.delete({ where: { id } });
};
