import { ConcatenatedVideo, DownloadedVideo } from "@prisma/client";
import { downloadRange } from "../services/downloads";
import { videoConcat } from "../services/videos/video-concat";
import { YoutubeUploadVideoDetail } from "../types/Youtube.type";
import { youtubeUpload } from "../services/uploads/youtube-upload";
import { configDotenv } from "dotenv";
import { extendDownloadedVideoData } from "../utilities/Video";
import { getAudioSpike } from "../services/videos/get-audio-spike";
import { convertHHMMSSStringToSeconds, convertSecondsToHHMMSSString } from "../utilities/Time";

configDotenv()

export interface SourceVideoHighlight {
    url: string;
    highlights: {
        start: string;
        end: string;
    }[]
}

export interface  DownloadAndUploadVideoRequest {
    sources: {
        url: string;
        resolution?: { width: number, height: number }
        highlights?: {
            start: string;
            end: string;
        }[],
        autoHighlights?: boolean
    }[],
    concat?: boolean;
    youtube?: YoutubeUploadVideoDetail | null | undefined;
}

export interface DownloadedVideoHighlight {
    start: string;
    end: string;
    downloadVideo: DownloadedVideo
}

export interface  DownloadAndUploadVideoResponse {
    sources: DownloadedVideo[];
    concatVideo: ConcatenatedVideo | null;
    youtubeVideoId: string | null;
}

export async function downloadAndUploadVideoAPI(payload: DownloadAndUploadVideoRequest): Promise<DownloadAndUploadVideoResponse> {
    
    const response:DownloadAndUploadVideoResponse = {
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

        let totalSourceHighlights: {
            start: string;
            end: string;
        }[] = []

        if (source.autoHighlights) {
            const video = await downloadRange(source.url, {
                resolution: source.resolution
            })

            const audioSpike = await getAudioSpike(`${process.env.VIDEO_STORAGE_PATH}/${video.filename}`)
            for (const spike of audioSpike) {
                
                let start = Math.floor(spike) - 10
                if (start < 0) {
                    start = 0
                }

                let end = Math.floor(spike) + 20
                if (end > video.duration) {
                    end = video.duration
                }
                
                totalSourceHighlights.push({
                    start: convertSecondsToHHMMSSString(start),
                    end: convertSecondsToHHMMSSString(end)
                })
            }
        }
        
        if (source.highlights && source.highlights.length > 0 || source.autoHighlights) {

            if (source.highlights && source.highlights.length > 0) {
                totalSourceHighlights.push(...source.highlights)
            }

            for (const highlight of totalSourceHighlights) {
                const video = await downloadRange(source.url, {
                    range: {
                        start: highlight.start,
                        end: highlight.end
                    },
                    resolution: source.resolution
                })
                sourceResponse.highlights.push({
                    start: highlight.start,
                    end: highlight.end,
                    downloadVideo: video
                })
                highlightFilenames.push(video.filename)
                response.sources.push(extendDownloadedVideoData(video))
            }

        }
        else {
            const video = await downloadRange(source.url, {
                resolution: source.resolution
            })
            highlightFilenames.push(video.filename)
            response.sources.push(extendDownloadedVideoData(video))
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