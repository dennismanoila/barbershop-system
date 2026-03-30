import { Router } from "express";
import { loginHandler, registerHandler } from "../controllers/authController";

const router = Router();

router.post("/auth/register", registerHandler);
router.post("/auth/login", loginHandler);

export default router;
