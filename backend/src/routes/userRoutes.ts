import { Router } from "express";
import { getBarbersHandler } from "../controllers/userController";

const router = Router();

router.get("/barbers", getBarbersHandler);

export default router;
