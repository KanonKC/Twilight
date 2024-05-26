"use strict";
// twitch-dl download https://www.twitch.tv/kanonkc/clip/RefinedBlatantWoodcockPartyTime-5Z3UtcRwvm-dO4s3 -q source
Object.defineProperty(exports, "__esModule", { value: true });
exports.twitchDownload = void 0;
const child_process_1 = require("child_process");
const twitch_info_1 = require("./twitch-info");
const RandomString_1 = require("../utilities/RandomString");
async function twitchDownload(url) {
    console.log("Downloading video ...");
    const videoInfo = await (0, twitch_info_1.getTwitchVideoInfo)(url);
    const randomString = (0, RandomString_1.generateRandomString)(4);
    const id = `twitch_${videoInfo.id}_${randomString}`;
    const filename = `${id}.mp4`;
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)(`twitch-dl download ${url} -q source --overwrite -o src/dumps/${filename}`, (error, stdout, stderr) => {
            if (error) {
                console.warn(error);
            }
            if (stdout) {
                console.log(stdout);
                resolve({
                    id: id,
                    filaneme: filename,
                    platform: {
                        name: "Twitch",
                        id: videoInfo.id,
                    },
                    title: videoInfo.title,
                });
            }
            else {
                throw new Error(stderr);
                // reject()
            }
        });
    });
}
exports.twitchDownload = twitchDownload;
