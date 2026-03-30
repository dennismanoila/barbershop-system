"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
router.post("/auth/register", authController_1.registerHandler);
router.post("/auth/login", authController_1.loginHandler);
exports.default = router;
