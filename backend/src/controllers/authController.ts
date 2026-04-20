import { Request, Response, NextFunction } from "express";
import { registerUser, loginUser } from "../services/authService";
import { asyncHandler } from "../utils/asyncHandler";

export const registerHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required",
      });
    }

    const user = await registerUser(email, password);

    res.status(201).json(user);
  },
);

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
