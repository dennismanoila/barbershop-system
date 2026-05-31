import { Request, Response, NextFunction } from "express";
import { registerUser, loginUser } from "../services/authService";
import { findUserById, updateUserName } from "../repositories/userRepository";
import { asyncHandler } from "../utils/asyncHandler";

export const registerHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required",
      });
    }

    const user = await registerUser(email, password, firstName, lastName);

    res.status(201).json(user);
  },
);

export const getMeHandler = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const user = await findUserById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

export const updateProfileHandler = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const { firstName, lastName } = req.body;
  if (!firstName?.trim() && !lastName?.trim()) {
    return res.status(400).json({ message: "Provide at least a first or last name" });
  }
  const user = await updateUserName(userId, firstName?.trim() ?? "", lastName?.trim() ?? "");
  res.json(user);
});

export const loginHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required",
      });
    }

    const result = await loginUser(email, password);

    res.json(result);
  },
);
