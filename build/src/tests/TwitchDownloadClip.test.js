"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const twitch_download_1 = require("../services/twitch-download");
const video_trim_1 = require("../services/video-trim");
(0, twitch_download_1.twitchDownload)("https://www.twitch.tv/kanonkc/clip/RefinedBlatantWoodcockPartyTime-5Z3UtcRwvm-dO4s3").then((video) => {
    (0, video_trim_1.videoTrim)(video, 6, 8).then((result) => {
        console.log("-------------------------");
        console.log(result);
        console.log("-------------------------");
    });
});
