import { FastifyReply, FastifyRequest } from "fastify"
import { videoTrim } from "../services/video-trim"
import { youtubeDownload } from "../services/youtube-download"
import { DownloadManyVideoRequest, DownloadManyVideoResponse, DownloadedVideo, VideoTrimResult } from "../types/Video"
import { convertHHMMSSStringToSeconds } from "../utilities/Time"
import { twitchDownload } from "../services/twitch-download"
import { Model } from "sequelize"
import { DownloadVideoAttribute } from "../models/types"
import { getVaultVideo } from "../services/get-vault-video"

export async function downloadManyVideos(request:FastifyRequest,reply:FastifyReply):Promise<DownloadManyVideoResponse> {
    const req = request.body as DownloadManyVideoRequest
    const response:DownloadManyVideoResponse = {videos: []}
    for (const videoData of req.videos) {

        let video:Model<DownloadVideoAttribute, DownloadVideoAttribute> | null = await getVaultVideo(videoData.url)

        if (!video) {
            if (videoData.url.includes("youtube")) {
                video = await youtubeDownload(videoData.url)
            }
            else if (videoData.url.includes("twitch")) {
                video = await twitchDownload(videoData.url)
            }
        }
        
        if (!video) {
            return reply.status(400).send({error: "Invalid URL"})
        }
        
        const trimmedVideos:VideoTrimResult[] = []
        if (videoData.highlight.length > 0) {
            for (const highlight of videoData.highlight) {
                const start = convertHHMMSSStringToSeconds(highlight.start)
                const end = convertHHMMSSStringToSeconds(highlight.end)
                const editedVideo = await videoTrim(video.dataValues, start, end)
                trimmedVideos.push(editedVideo)
            }
        }
        response.videos.push({video: video.dataValues, trimmedVideos})
    }
    return response
}