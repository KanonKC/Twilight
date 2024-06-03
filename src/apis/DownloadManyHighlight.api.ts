import { DownloadVideoAttribute } from "../models/types";
import { youtubeDownloadRange } from "../services/youtube-download-range";

export interface DownloadManyHighlightRequest {
    url: string;
    highlights: {
        start: string;
        end: string;
    }[]
}

export interface DownloadManyHighlightResponse {
    url: string;
    highlights: {
        start: string;
        end: string;
        downloadVideo: DownloadVideoAttribute
    }[]
}

export async function downloadManyHighlightsAPI(payload:DownloadManyHighlightRequest):Promise<DownloadManyHighlightResponse> {

    const response:DownloadManyHighlightResponse = {
        url: payload.url,
        highlights: []
    }

    for (const highlight of payload.highlights) {
        const video = await youtubeDownloadRange(payload.url, highlight.start, highlight.end)
        response.highlights.push({
            start: highlight.start,
            end: highlight.end,
            downloadVideo: video.dataValues
        })
    }

    return response
}