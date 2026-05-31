import { Router } from "express";
import {
  loginHandler,
  registerHandler,
  getMeHandler,
  updateProfileHandler,
} from "../controllers/authController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/auth/register", registerHandler);
router.post("/auth/login", loginHandler);
router.get("/auth/me", authMiddleware, getMeHandler);
router.patch("/auth/profile", authMiddleware, updateProfileHandler);

export default router;
