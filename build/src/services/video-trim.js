"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoTrim = void 0;
const child_process_1 = require("child_process");
async function videoTrim(video, start, end) {
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)(`python src/modules/video-trim.py src/dumps/${video.filaneme} ${start} ${end}`, (error, stdout, stderr) => {
            if (error) {
                console.warn(error);
            }
            if (stdout) {
                resolve({
                    originalVideo: video,
                    editedVideo: Object.assign(Object.assign({}, video), { id: stdout.split("[id]")[1], filaneme: stdout.split("[filename]")[1] }),
                    start,
                    end
                });
            }
            else {
                throw new Error(stderr);
                // reject()
            }
        });
    });
}
exports.videoTrim = videoTrim;
