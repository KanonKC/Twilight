import { DownloadVideoAttribute } from "../models/types";
import { YoutubeUploadVideoDetail, YoutubeUploadVideoResponse, youtubeUpload } from "../services/youtube-upload";

export interface UploadVideoToYoutubeRequest {
    file: string | DownloadVideoAttribute;
    detail: YoutubeUploadVideoDetail;
}

export interface UploadVideoToYoutubeResponse extends YoutubeUploadVideoResponse {}

export async function uploadVideoToYoutubeAPI(payload: UploadVideoToYoutubeRequest):Promise<UploadVideoToYoutubeResponse> {

    let filePath:string = ""
    if (typeof payload.file === "string") {
        filePath = payload.file
    }
    else {
        filePath = payload.file.filename
    }

    const response = await youtubeUpload(filePath, payload.detail)
    return response
}