import { downloadRange } from "../services/downloads";
import { YoutubeUploadVideoDetail, youtubeUpload } from "../services/uploads/youtube-upload";

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
    const targetFilePath = `src/dumps/${targetFilename}`
    
    const uploadResponse = await youtubeUpload(targetFilePath,payload.videoDetail)
    return { url: `https://youtube.com/watch?v=${uploadResponse.videoId}`}
}