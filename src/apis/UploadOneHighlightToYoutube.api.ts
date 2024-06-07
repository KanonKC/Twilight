import { twitchDownloadRange } from "../services/twitch-download-range";
import { YoutubeUploadVideoDetail, youtubeUpload } from "../services/youtube-upload";
import { youtubeDownloadRange } from "../services/youtube-download-range";
import { Model } from "sequelize";
import { DownloadVideoAttribute } from "../models/types";
import { downloadRange } from "../services/download-range";

export interface UploadOneTwitchHighlightToYoutubeRequest {
    url: string;
    highlight: {
        start: string;
        end: string;
    }
    videoDetail: YoutubeUploadVideoDetail;
}

export interface UploadOneTwitchHighlightToYoutubeResponse {
    url: string;
}

export async function uploadOneHighlightToYoutubeAPI(payload:UploadOneTwitchHighlightToYoutubeRequest): Promise<UploadOneTwitchHighlightToYoutubeResponse> {

    const video = await downloadRange(payload.url,payload.highlight.start,payload.highlight.end)
    
    const targetFilename = video.dataValues.filename
    const targetFilePath = `src/dumps/${targetFilename}`
    
    const uploadResponse = await youtubeUpload(targetFilePath,payload.videoDetail)
    return { url: `https://youtube.com/watch?v=${uploadResponse.videoId}`}
}