"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadManyVideosFromYoutube = void 0;
const video_trim_1 = require("../services/video-trim");
const youtube_download_1 = require("../services/youtube-download");
const Time_1 = require("../utilities/Time");
async function downloadManyVideosFromYoutube(request) {
    const response = { videos: [] };
    for (const youtubeVideo of request.videos) {
        const video = await (0, youtube_download_1.youtubeDownload)(youtubeVideo.url);
        const trimmedVideos = [];
        if (youtubeVideo.highlight.length > 0) {
            for (const highlight of youtubeVideo.highlight) {
                const start = (0, Time_1.convertHHMMSSStringToSeconds)(highlight.start);
                const end = (0, Time_1.convertHHMMSSStringToSeconds)(highlight.end);
                const editedVideo = await (0, video_trim_1.videoTrim)(video, start, end);
                trimmedVideos.push(editedVideo);
            }
        }
        response.videos.push({ video, trimmedVideos });
    }
    return response;
}
exports.downloadManyVideosFromYoutube = downloadManyVideosFromYoutube;
