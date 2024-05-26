"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const ytdl_core_1 = __importDefault(require("ytdl-core"));
function secondToByte(second) {
    return second * 1000000;
}
const data = JSON.parse((0, fs_1.readFileSync)("downloads/download.json", "utf8"));
const videoRange = { start: 1035570, end: 1245285 };
(0, ytdl_core_1.default)(data.url, { quality: "highestvideo", /* range: videoRange */ }).pipe((0, fs_1.createWriteStream)(`downloads/${data.title}_video.mp4`));
(0, ytdl_core_1.default)(data.url, { quality: "highestaudio", /* range: videoRange */ }).pipe((0, fs_1.createWriteStream)(`downloads/${data.title}_audio.mp3`));
