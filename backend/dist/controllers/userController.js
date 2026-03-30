"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBarbersHandler = void 0;
const userService_1 = require("../services/userService");
const getBarbersHandler = async (req, res) => {
    const barbers = await (0, userService_1.getBarbers)();
    res.json(barbers);
};
exports.getBarbersHandler = getBarbersHandler;
