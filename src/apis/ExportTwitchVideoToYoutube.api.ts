import { DownloadVideoAttribute } from "../models/types";
import { downloadRange } from "../services/downloads";
import { getTwitchVideoInfo } from "../services/downloads/platforms/twitch-info";
import { YoutubeUploadVideoResponse, youtubeUpload } from "../services/uploads/youtube-upload";

export interface ExportTwitchVideoToYoutubeRequest {
    url: string;
}

export interface ExportTwitchVideoToYoutubeResponse {
    downloadedVideo: DownloadVideoAttribute
    youtube: YoutubeUploadVideoResponse
}

export async function exportTwitchVideoToYoutube(payload: ExportTwitchVideoToYoutubeRequest):Promise<ExportTwitchVideoToYoutubeResponse> {
    const videoInfo = await getTwitchVideoInfo(payload.url)
    const video = await downloadRange(payload.url)

    const youtubeVideo = await youtubeUpload(`src/dumps/${video.dataValues.filename}`,{
        title: videoInfo.title,
        privacyStatus: "unlisted"
    })

    return {downloadedVideo: video.dataValues, youtube: youtubeVideo}
}