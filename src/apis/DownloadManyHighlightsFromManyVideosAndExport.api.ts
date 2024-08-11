import { ConcatenatedVideo, DownloadedVideo } from "@prisma/client";
import { downloadRange } from "../services/downloads";
import { videoConcat } from "../services/videos/video-concat";
import { YoutubeUploadVideoDetail } from "../types/Youtube";
import { youtubeUpload } from "../services/uploads/youtube-upload";
import { configDotenv } from "dotenv";

configDotenv()

export interface SourceVideoHighlight {
    url: string;
    highlights: {
        start: string;
        end: string;
    }[]
}

export interface  DownloadManyHighlightsFromManyVideosAndExportRequest {
    sources: {
        url: string;
        highlights: {
            start: string;
            end: string;
        }[]
    }[],
    concat?: boolean;
    youtube?: YoutubeUploadVideoDetail | null | undefined;
}

export interface DownloadedVideoHighlight {
    start: string;
    end: string;
    downloadVideo: DownloadedVideo
}

export interface  DownloadManyHighlightsFromManyVideosAndExportResponse {
    sources: {
        url: string;
        highlights: DownloadedVideoHighlight[]
    }[],
    concatVideo: ConcatenatedVideo | null;
    youtubeVideoId: string | null;
}

export async function downloadManyHighlightsFromManyVideosAndExportAPI(payload: DownloadManyHighlightsFromManyVideosAndExportRequest): Promise<DownloadManyHighlightsFromManyVideosAndExportResponse> {
    
    const response:DownloadManyHighlightsFromManyVideosAndExportResponse = {
        sources: [],
        concatVideo: null,
        youtubeVideoId: null
    }

    const highlightFilenames:string[] = []

    for (const source of payload.sources) {

        const sourceResponse:{
            url: string;
            highlights: DownloadedVideoHighlight[]
        } = {
            url: source.url,
            highlights: []
        }
        
        for (const highlight of source.highlights) {
            const video = await downloadRange(source.url, highlight.start, highlight.end)
            sourceResponse.highlights.push({
                start: highlight.start,
                end: highlight.end,
                downloadVideo: video
            })
            highlightFilenames.push(video.filename)
        }
    }

    if (payload.concat || payload.youtube) {
        const concatVideo = await videoConcat(highlightFilenames, undefined)
        response.concatVideo = concatVideo

        if (payload.youtube) {
            const youtubeUploadResponse = await youtubeUpload(`${process.env.VIDEO_STORAGE_PATH}/${concatVideo.filename}`, payload.youtube)
            response.youtubeVideoId = youtubeUploadResponse.videoId
        }
    }

    return response
}