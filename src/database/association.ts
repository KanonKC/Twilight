import { ConcatenatedVideo, DownloadedVideo } from "../models";

DownloadedVideo.belongsToMany(ConcatenatedVideo, {
    through: "DownloadedVideoConcatenatedVideo",
    foreignKey: "downloadedVideoId"
})

ConcatenatedVideo.belongsToMany(DownloadedVideo, {
    through: "DownloadedVideoConcatenatedVideo",
    foreignKey: "concatenatedVideoId"
})