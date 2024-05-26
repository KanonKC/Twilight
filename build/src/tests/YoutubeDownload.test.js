"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const video_trim_1 = require("../services/video-trim");
const youtube_download_1 = require("../services/youtube-download");
(0, youtube_download_1.youtubeDownload)("https://www.youtube.com/watch?v=ng5Cq2YEaRU").then((video) => {
    console.log("Download completed, trimming video ...");
    console.log(video);
    (0, video_trim_1.videoTrim)(video, 5, 7).then((result) => {
        console.log("Done");
        console.log(result);
    });
});
