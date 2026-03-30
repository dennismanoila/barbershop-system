import { Request, Response } from "express";
import { getBarbers } from "../services/userService";

export const getBarbersHandler = async (req: Request, res: Response) => {
  const barbers = await getBarbers();
  res.json(barbers);
};
