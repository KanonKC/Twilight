import { DownloadVideoAttribute } from "../models/types";
import { YoutubeUploadVideoDetail, YoutubeUploadVideoResponse, youtubeUpload } from "../services/youtube-upload";

export interface UploadVideoToYoutubeRequest {
    file: string;
    detail: YoutubeUploadVideoDetail;
}

export interface UploadVideoToYoutubeResponse extends YoutubeUploadVideoResponse {}

export async function uploadVideoToYoutubeAPI(payload: UploadVideoToYoutubeRequest):Promise<UploadVideoToYoutubeResponse> {
    const response = await youtubeUpload(`src/dumps/${payload.file}`, payload.detail)
    return response
}