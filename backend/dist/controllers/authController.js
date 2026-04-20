"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginHandler = exports.registerHandler = void 0;
const authService_1 = require("../services/authService");
const asyncHandler_1 = require("../utils/asyncHandler");
exports.registerHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password required",
        });
    }
    const user = await (0, authService_1.registerUser)(email, password);
    res.status(201).json(user);
});
exports.loginHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password required",
        });
    }
    const result = await (0, authService_1.loginUser)(email, password);
    res.json(result);
});
