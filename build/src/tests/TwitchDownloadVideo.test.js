"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = require("node:test");
const twitch_download_1 = require("../services/twitch-download");
const video_trim_1 = require("../services/video-trim");
const chai_1 = require("chai");
// twitchDownload("https://www.twitch.tv/kanonkc/clip/RefinedBlatantWoodcockPartyTime-5Z3UtcRwvm-dO4s3").then((video) => {
//     videoTrim(video,6,8).then((result) => {
//         console.log("-------------------------")
//         console.log(result)
//         console.log("-------------------------")
//     })
// })
// twitchDownload("https://www.twitch.tv/videos/1214826771").then((video) => {
//     videoTrim(video,6,8).then((result) => {
//         console.log("-------------------------")
//         console.log(result)
//         console.log("-------------------------")
//     })
// })
(0, node_test_1.describe)("TwitchDownloadVideo", () => {
    (0, node_test_1.it)("should download a video from Twitch", async () => {
        const video = await (0, twitch_download_1.twitchDownload)("https://www.twitch.tv/videos/1214826771");
        (0, chai_1.expect)(video).haveOwnProperty("id");
    });
    (0, node_test_1.it)("should trim a video from Twitch", async () => {
        const video = await (0, twitch_download_1.twitchDownload)("https://www.twitch.tv/videos/1214826771");
        const trimmedVideo = await (0, video_trim_1.videoTrim)(video, 6, 8);
        (0, chai_1.expect)(trimmedVideo).haveOwnProperty("id");
        (0, chai_1.expect)(trimmedVideo).haveOwnProperty("filename");
        (0, chai_1.expect)(trimmedVideo).haveOwnProperty("platform");
        (0, chai_1.expect)(trimmedVideo).haveOwnProperty("title");
    });
});
