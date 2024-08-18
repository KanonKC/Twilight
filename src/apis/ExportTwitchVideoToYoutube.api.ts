import { DownloadedVideo } from "@prisma/client";
import { downloadRange } from "../services/downloads";
import { getTwitchVideoData } from "../services/downloads/platforms/get-twitch-video-data";
import { YoutubeUploadVideoResponse, youtubeUpload } from "../services/uploads/youtube-upload";
import { configDotenv } from "dotenv";

configDotenv()

export interface ExportTwitchVideoToYoutubeRequest {
    url: string;
}

export interface ExportTwitchVideoToYoutubeResponse {
    downloadedVideo: DownloadedVideo;
    youtube: YoutubeUploadVideoResponse
}

export async function exportTwitchVideoToYoutube(payload: ExportTwitchVideoToYoutubeRequest):Promise<ExportTwitchVideoToYoutubeResponse> {
    const videoInfo = await getTwitchVideoData(payload.url)
    const video = await downloadRange(payload.url)

    const youtubeVideo = await youtubeUpload(`${process.env.VIDEO_STORAGE_PATH}/${video.filename}`,{
        title: videoInfo.title,
        privacyStatus: "unlisted"
    })

    return {downloadedVideo: video, youtube: youtubeVideo}
}