"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.youtubeDownload = void 0;
const child_process_1 = require("child_process");
async function youtubeDownload(url) {
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)(`python src/modules/youtube-download.py ${url}`, (error, stdout, stderr) => {
            if (error) {
                console.warn(error);
            }
            if (stdout) {
                resolve({
                    id: stdout.split("[video_unique_id]")[1],
                    filaneme: stdout.split("[filename]")[1],
                    platform: {
                        name: "Youtube",
                        id: stdout.split("[platform_id]")[1],
                    },
                    title: stdout.split("[video_title]")[1],
                });
            }
            else {
                throw new Error(stderr);
                // reject()
            }
        });
    });
}
exports.youtubeDownload = youtubeDownload;
