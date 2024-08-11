import { ConcatenatedVideo, DownloadedVideo } from "@prisma/client";
import { downloadRange } from "../services/downloads";
import { videoConcat } from "../services/videos/video-concat";

interface DownloadManyHighlightsFromManyVideosAPIRequest {
    videos: {
        url: string;
        highlights: {
            start: string;
            end: string;
        }[]
    }[]
    concat?: boolean;
    concatVideoTitle?: string;
}

interface DownloadManyHighlightsFromManyVideosAPIResponse {
    videos: {
        url: string;
        highlights: {
            start: string;
            end: string;
            downloadVideo: DownloadedVideo
        }[]
    }[]
    concatVideo: ConcatenatedVideo | null;
}

export async function DownloadManyHighlightsFromManyVideosAPI(payload:DownloadManyHighlightsFromManyVideosAPIRequest): Promise<DownloadManyHighlightsFromManyVideosAPIResponse> {
    
    const response:DownloadManyHighlightsFromManyVideosAPIResponse = {
        videos: [],
        concatVideo: null
    }
    const highlightFilenames:string[] = []

    for (const video of payload.videos) {

        const videoHighlightsResponse: {
            start: string;
            end: string;
            downloadVideo: DownloadedVideo
        }[] = []

        for (const highlight of video.highlights) {
            const downloadModel = await downloadRange(video.url, highlight.start, highlight.end)
            highlightFilenames.push(downloadModel.filename)
            videoHighlightsResponse.push({
                start: highlight.start,
                end: highlight.end,
                downloadVideo: downloadModel
            })
        }

        response.videos.push({
            url: video.url,
            highlights: videoHighlightsResponse
        })

    }

    if (payload.concat) {
        const concatVideoModel = await videoConcat(highlightFilenames, undefined)
        response.concatVideo = concatVideoModel
    }

    return response
}