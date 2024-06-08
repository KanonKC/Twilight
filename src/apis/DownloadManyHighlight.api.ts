import { DownloadVideoAttribute } from "../models/types";
import { downloadRange } from "../services/download-range";
import { videoConcat } from "../services/video-concat";

export interface DownloadManyHighlightRequest {
    url: string;
    highlights: {
        start: string;
        end: string;
    }[]
    concat: boolean;
}

export interface DownloadManyHighlightResponse {
    url: string;
    highlights: {
        start: string;
        end: string;
        downloadVideo: DownloadVideoAttribute
    }[]
    concatVideo: DownloadVideoAttribute | null;
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
            downloadVideo: video.dataValues
        })
        highlightFilenames.push(video.dataValues.filename)
    }

    if (payload.concat) {
        const concatVideo = await videoConcat(highlightFilenames)
        response.concatVideo = concatVideo.dataValues
    }

    return response
}