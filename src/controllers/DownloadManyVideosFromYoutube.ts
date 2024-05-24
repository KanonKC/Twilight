import { videoTrim } from "../services/video-trim"
import { youtubeDownload } from "../services/youtube-download"
import { DownloadedVideo, VideoTrimResult } from "../types/Video"
import { convertHHMMSSStringToSeconds } from "../utilities/Time"

export interface DownloadManyVideoFromYoutubeRequest {
    videos: {
        url: string,
        highlight: {
            start: string,
            end: string
        }[]
    }[]
}

export interface DownloadManyVideoFromYoutubeResponse {
    videos: {
        video: DownloadedVideo,
        trimmedVideos: VideoTrimResult[]
    }[]

}

export async function downloadManyVideosFromYoutube(request:DownloadManyVideoFromYoutubeRequest):Promise<DownloadManyVideoFromYoutubeResponse> {
    const response:DownloadManyVideoFromYoutubeResponse = {videos: []}
    for (const youtubeVideo of request.videos) {
        const video = await youtubeDownload(youtubeVideo.url)
        const trimmedVideos:VideoTrimResult[] = []
        if (youtubeVideo.highlight.length > 0) {
            for (const highlight of youtubeVideo.highlight) {
                const start = convertHHMMSSStringToSeconds(highlight.start)
                const end = convertHHMMSSStringToSeconds(highlight.end)
                const editedVideo = await videoTrim(video, start, end)
                trimmedVideos.push(editedVideo)
            }
        }
        response.videos.push({video, trimmedVideos})
    }
    return response
}