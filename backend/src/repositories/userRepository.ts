import { prisma } from "../lib/prisma";

export const createUser = async (data: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}) => {
  return prisma.user.create({ data });
};

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export const findBarbers = async () => {
  return prisma.user.findMany({
    where: { role: "BARBER" },
    select: { id: true, email: true, firstName: true, lastName: true },
  });
};

export const findAllUsers = async () => {
  return prisma.user.findMany({
    select: { id: true, email: true, firstName: true, lastName: true, role: true, banned: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });
};

export const findUserById = async (id: number) => {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, firstName: true, lastName: true, role: true },
  });
};

export const updateUserName = async (id: number, firstName: string, lastName: string) => {
  return prisma.user.update({
    where: { id },
    data: { firstName, lastName },
    select: { id: true, email: true, firstName: true, lastName: true, role: true },
  });
};

export const updateUserRole = async (id: number, role: string) => {
  return prisma.user.update({ where: { id }, data: { role } });
};

export const updateUserBanned = async (id: number, banned: boolean) => {
  return prisma.user.update({ where: { id }, data: { banned } });
};
