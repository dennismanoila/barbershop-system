"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const serviceRoutes_1 = __importDefault(require("./routes/serviceRoutes"));
const errorMiddleware_1 = require("./middlewares/errorMiddleware");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const appointmentRoutes_1 = __importDefault(require("./routes/appointmentRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const PORT = 3000;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(serviceRoutes_1.default);
app.use(authRoutes_1.default);
app.use(appointmentRoutes_1.default);
app.use(userRoutes_1.default);
app.use(errorMiddleware_1.errorHandler);
app.get("/", (req, res) => {
    res.send("Barbershop API is running");
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
