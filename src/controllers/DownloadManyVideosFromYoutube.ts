import { videoTrim } from "../services/video-trim"
import { youtubeDownload } from "../services/youtube-download"
import { convertHHMMSSStringToSeconds } from "../utilities/Time"

export interface DownloadManyVideoFromYoutubeRequest {
    youtube: {
        url: string,
        highlight: {
            start: string,
            end: string
        }[]
    }[]
}

export async function downloadManyVideosFromYoutube(request:DownloadManyVideoFromYoutubeRequest) {
    for (const youtubeVideo of request.youtube) {
        console.log("Start downloading video from youtube...")
        const video = await youtubeDownload(youtubeVideo.url)
        console.log("Video downloaded")
        if (youtubeVideo.highlight.length > 0) {
            for (const highlight of youtubeVideo.highlight) {
                console.log("Start trimming video...")
                const start = convertHHMMSSStringToSeconds(highlight.start)
                const end = convertHHMMSSStringToSeconds(highlight.end)
                const editedVideo = await videoTrim(video, start, end)
                console.log(editedVideo)
                console.log("-------------------------")
            }
        }
    }
}