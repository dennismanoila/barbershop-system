"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBarbers = void 0;
const userRepository_1 = require("../repositories/userRepository");
const getBarbers = async () => {
    return (0, userRepository_1.findBarbers)();
};
exports.getBarbers = getBarbers;
