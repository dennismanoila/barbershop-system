import { Request, Response } from "express";
import {
  findAllUsers,
  updateUserBanned,
  updateUserRole,
} from "../repositories/userRepository";

const VALID_ROLES = ["CLIENT", "BARBER", "ADMIN"];

export const getAllUsersHandler = async (req: Request, res: Response) => {
  const users = await findAllUsers();
  res.json(users);
};

export const updateRoleHandler = async (req: Request, res: Response) => {
  const requestingUserId = (req as any).user.userId;
  const { id } = req.params;
  const { role } = req.body;

  if (!VALID_ROLES.includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  if (Number(id) === requestingUserId) {
    return res.status(400).json({ message: "Cannot change your own role" });
  }

  const user = await updateUserRole(Number(id), role);
  res.json(user);
};

export const updateBanHandler = async (req: Request, res: Response) => {
  const requestingUserId = (req as any).user.userId;
  const { id } = req.params;
  const { banned } = req.body;

  if (typeof banned !== "boolean") {
    return res.status(400).json({ message: "banned must be a boolean" });
  }

  if (Number(id) === requestingUserId) {
    return res.status(400).json({ message: "Cannot ban yourself" });
  }

  const user = await updateUserBanned(Number(id), banned);
  res.json(user);
};
