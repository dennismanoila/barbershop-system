import { Router } from "express";
import { getAllUsersHandler, updateBanHandler, updateRoleHandler } from "../controllers/adminController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { requireRole } from "../middlewares/roleMiddleware";

const router = Router();

const adminOnly = [authMiddleware, requireRole("ADMIN")];

router.get("/admin/users", ...adminOnly, getAllUsersHandler);
router.patch("/admin/users/:id/role", ...adminOnly, updateRoleHandler);
router.patch("/admin/users/:id/ban", ...adminOnly, updateBanHandler);

export default router;
