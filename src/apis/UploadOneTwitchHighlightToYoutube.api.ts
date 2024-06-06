import { twitchDownloadRange } from "../services/twitch-download-range";
import { YoutubeUploadVideoDetail, youtubeUpload } from "../services/youtube-upload";

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

export async function uploadOneTwitchHighlightToYoutubeAPI(payload:UploadOneTwitchHighlightToYoutubeRequest): Promise<UploadOneTwitchHighlightToYoutubeResponse> {
    const twitchVideo = await twitchDownloadRange(payload.url,payload.highlight.start,payload.highlight.end)
    
    const targetFilename = twitchVideo.dataValues.filename
    const targetFilePath = `src/dumps/${targetFilename}`
    
    const uploadResponse = await youtubeUpload(targetFilePath,payload.videoDetail)
    return { url: `https://youtube.com/watch?v=${uploadResponse.videoId}`}
}