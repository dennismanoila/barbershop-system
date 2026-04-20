import { prisma } from "../lib/prisma";

export const createUser = async (data: { email: string; password: string }) => {
  return prisma.user.create({
    data,
  });
};

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export const findBarbers = async () => {
  return prisma.user.findMany({
    where: {
      role: "BARBER",
    },
    select: {
      id: true,
      email: true,
    },
  });
};
