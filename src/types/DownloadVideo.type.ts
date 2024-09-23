import { DownloadedVideo } from "@prisma/client";

export interface ExtendedDownloadedVideo extends DownloadedVideo {
    durationMilliseconds: number;
}

export interface DownloadVideoOptions {
    range?: {
        start: string;
        end: string;
    },
    resolution?: {
        width: number;
        height: number;
    }
}

export interface YoutubeVideo {
    title: string;
}

export interface TwitchVideo {
    id: string;
    slug: string;
    title: string;
    createdAt: string;
    viewCount: number;
    durationSeconds: number;
    url: string;
    videoQualities: {
        frameRate: number;
        quality: string;
        sourceURL: string;
    }[]
    game: {
        id: string;
        name: string;
    }
    broadcaster: {
        displayName: string;
        login: string;
    }
}

export interface VideoTrimResult {
    originalVideo: DownloadedVideo;
    editedVideo: DownloadedVideo;
    start: number;
    end: number;
}

export interface DownloadManyVideoRequest {
    videos: {
        url: string,
        highlight: {
            start: string,
            end: string
        }[]
    }[]
}

export interface DownloadManyVideoResponse {
    videos: {
        video: DownloadedVideo,
        trimmedVideos: VideoTrimResult[]
    }[]
}
