export interface DownloadVideoAttribute {
    id: string;
    title: string;
    filename: string;
    platform: string;
    platformId: string;
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

