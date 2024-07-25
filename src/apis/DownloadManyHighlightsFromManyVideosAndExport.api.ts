import { DownloadVideoAttribute } from "../models/types";
import { downloadRange } from "../services/download-range";
import { videoConcat } from "../services/video-concat";
import { youtubeUpload, YoutubeUploadVideoDetail } from "../services/youtube-upload";

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
    downloadVideo: DownloadVideoAttribute
}

export interface  DownloadManyHighlightsFromManyVideosAndExportResponse {
    sources: {
        url: string;
        highlights: DownloadedVideoHighlight[]
    }[],
    concatVideo: DownloadVideoAttribute | null;
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
                downloadVideo: video.dataValues
            })
            highlightFilenames.push(video.dataValues.filename)
        }
    }

    if (payload.concat || payload.youtube) {
        const concatVideo = await videoConcat(highlightFilenames)
        response.concatVideo = concatVideo.dataValues

        if (payload.youtube) {
            const youtubeUploadResponse = await youtubeUpload(`src/dumps/${concatVideo.dataValues.filename}`, payload.youtube)
            response.youtubeVideoId = youtubeUploadResponse.videoId
        }
    }

    return response
}