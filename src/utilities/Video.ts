import { DownloadedVideo } from "@prisma/client";
import { ExtendedDownloadedVideo } from "../types/Video";

export function extendDownloadedVideoData(downloadedVideo: DownloadedVideo): ExtendedDownloadedVideo {
    return {
        ...downloadedVideo,
        durationMilliseconds: downloadedVideo.duration * 1000
    }
}