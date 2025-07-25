import { DownloadedVideo } from "@prisma/client";

export interface VideoTrimResult {
    originalVideo: DownloadedVideo;
    editedVideo: DownloadedVideo;
    start: number;
    end: number;
}
