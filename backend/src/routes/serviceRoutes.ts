import { Router } from "express";
import {
  getServices,
  createServiceHandler,
  deleteServiceHandler,
} from "../controllers/serviceController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { requireRole } from "../middlewares/roleMiddleware";

const router = Router();

router.get("/services", getServices);
router.post("/services", authMiddleware, requireRole("ADMIN"), createServiceHandler);
router.delete("/services/:id", authMiddleware, requireRole("ADMIN"), deleteServiceHandler);

export default router;
