"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userRepository_1 = require("../repositories/userRepository");
const registerUser = async (email, password) => {
    const existingUser = await (0, userRepository_1.findUserByEmail)(email);
    if (existingUser) {
        throw new Error("User already exists");
    }
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    return (0, userRepository_1.createUser)({
        email,
        password: hashedPassword,
    });
};
exports.registerUser = registerUser;
const loginUser = async (email, password) => {
    const user = await (0, userRepository_1.findUserByEmail)(email);
    if (!user) {
        throw new Error("Invalid credentials");
    }
    const isMatch = await bcrypt_1.default.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Invalid credentials");
    }
    const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
    return {
        token,
        user,
    };
};
exports.loginUser = loginUser;
