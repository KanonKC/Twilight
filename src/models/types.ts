interface SequelizeBaseAttribute {
    createdAt: Date;
    updatedAt: Date;
}

export interface DownloadVideoAttribute {
    id: string;
    title: string | null;
    filename: string;
    platform: string;
    platformId: string;
    startRange: string | null;
    endRange: string | null;
}

export interface DownloadVideoCreation extends DownloadVideoAttribute {}

export interface TrimmedVideoAttribute {
    id: string;
    title: string;
    filename: string;
    originalVideoId: string;
    originalStartSecond: number;
    originalEndSecond: number;
}

export interface TrimmedVideoCreation extends TrimmedVideoAttribute {}

export interface ConcatenatedVideoAttribute {
    id: string;
    title: string;
    filename: string;
}

export interface ConcatenatedVideoCreation extends ConcatenatedVideoAttribute {}

export interface DownloadedVideoConcatenatedVideoAttribute {
    downloadedVideoId: string;
    concatenatedVideoId: string;
}

export interface DownloadedVideoConcatenatedVideoCreation extends DownloadedVideoConcatenatedVideoAttribute {}