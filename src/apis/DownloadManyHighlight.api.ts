import { ConcatenatedVideo, DownloadedVideo } from "@prisma/client";
import { downloadRange } from "../services/downloads";
import { videoConcat } from "../services/videos/video-concat";

export interface DownloadManyHighlightRequest {
    url: string;
    highlights: {
        start: string;
        end: string;
    }[]
    concatVideo: boolean;
}

export interface DownloadManyHighlightResponse {
    url: string;
    highlights: {
        start: string;
        end: string;
        downloadVideo: DownloadedVideo;
    }[]
    concatVideo: ConcatenatedVideo | null;
}

export async function downloadManyHighlightsAPI(payload:DownloadManyHighlightRequest):Promise<DownloadManyHighlightResponse> {

    const response:DownloadManyHighlightResponse = {
        url: payload.url,
        highlights: [],
        concatVideo: null
    }

    const highlightFilenames:string[] = []

    for (const highlight of payload.highlights) {
        const video = await downloadRange(payload.url, highlight.start, highlight.end)
        response.highlights.push({
            start: highlight.start,
            end: highlight.end,
            downloadVideo: video
        })
        highlightFilenames.push(video.filename)
    }

    if (payload.concatVideo) {
        const concatVideo = await videoConcat(highlightFilenames,"")
        response.concatVideo = concatVideo
    }

    return response
}