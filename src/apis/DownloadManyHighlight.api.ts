import { DownloadedVideo } from "@prisma/client";
import { downloadRange } from "../services/downloads";

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
        downloadVideo: DownloadedVideo;
    }[]
    concatVideo: DownloadedVideo | null;
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

    if (payload.concat) {
        // const concatVideo = await videoConcat(highlightFilenames,"")
        // response.concatVideo = concatVideo
    }

    return response
}