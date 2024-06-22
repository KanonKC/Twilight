"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertHHMMSSStringToSeconds = void 0;
function convertHHMMSSStringToSeconds(time) {
    const [hours, minutes, seconds] = time.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
}
exports.convertHHMMSSStringToSeconds = convertHHMMSSStringToSeconds;
