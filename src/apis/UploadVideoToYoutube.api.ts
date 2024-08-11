import { configDotenv } from "dotenv";
import { YoutubeUploadVideoResponse, youtubeUpload } from "../services/uploads/youtube-upload";
import { YoutubeUploadVideoDetail } from "../types/Youtube";

configDotenv();

export interface UploadVideoToYoutubeRequest {
    file: string;
    detail: YoutubeUploadVideoDetail;
}

export interface UploadVideoToYoutubeResponse extends YoutubeUploadVideoResponse {}

export async function uploadVideoToYoutubeAPI(payload: UploadVideoToYoutubeRequest):Promise<UploadVideoToYoutubeResponse> {
    const response = await youtubeUpload(`${process.env.VIDEO_STORAGE_PATH}/${payload.file}`, payload.detail)
    return response
}