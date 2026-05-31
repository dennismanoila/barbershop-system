"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginHandler = exports.updateProfileHandler = exports.getMeHandler = exports.registerHandler = void 0;
const authService_1 = require("../services/authService");
const userRepository_1 = require("../repositories/userRepository");
const asyncHandler_1 = require("../utils/asyncHandler");
exports.registerHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { email, password, firstName, lastName } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password required",
        });
    }
    const user = await (0, authService_1.registerUser)(email, password, firstName, lastName);
    res.status(201).json(user);
});
exports.getMeHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.userId;
    const user = await (0, userRepository_1.findUserById)(userId);
    if (!user)
        return res.status(404).json({ message: "User not found" });
    res.json(user);
});
exports.updateProfileHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.userId;
    const { firstName, lastName } = req.body;
    if (!firstName?.trim() && !lastName?.trim()) {
        return res.status(400).json({ message: "Provide at least a first or last name" });
    }
    const user = await (0, userRepository_1.updateUserName)(userId, firstName?.trim() ?? "", lastName?.trim() ?? "");
    res.json(user);
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
