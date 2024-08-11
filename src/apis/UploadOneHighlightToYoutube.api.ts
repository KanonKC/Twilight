import { configDotenv } from "dotenv";
import { downloadRange } from "../services/downloads";
import { youtubeUpload } from "../services/uploads/youtube-upload";
import { YoutubeUploadVideoDetail } from "../types/Youtube";

configDotenv();

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
    
    const targetFilename = video.filename
    const targetFilePath = `${process.env.VIDEO_STORAGE_PATH}/${targetFilename}`
    
    const uploadResponse = await youtubeUpload(targetFilePath,payload.videoDetail)
    return { url: `https://youtube.com/watch?v=${uploadResponse.videoId}`}
}