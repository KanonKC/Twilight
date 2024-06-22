import { DownloadVideoAttribute } from "../models/types";
import { downloadRange } from "../services/download-range";
import { getTwitchVideoInfo } from "../services/twitch-info";
import { YoutubeUploadVideoDetail, YoutubeUploadVideoResponse, youtubeUpload } from "../services/youtube-upload";

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