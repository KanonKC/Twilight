export interface CreateDownloadedVideo {
    title: string;
    filename: string;
    url: string;
    duration: number;
    platform: string;
    platformId: string;
    width: number;
    height: number;
    startTime?: number;
    endTime?: number;
}