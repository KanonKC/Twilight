import { DownloadVideoAttribute } from "../models/types";

export interface DownloadedVideo {
    id: string;
    filaneme: string;
    platform: "Youtube" | "Twitch";
    platformId: string;
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
    originalVideo: DownloadVideoAttribute;
    editedVideo: DownloadVideoAttribute;
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
        video: DownloadVideoAttribute,
        trimmedVideos: VideoTrimResult[]
    }[]
}

