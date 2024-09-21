import { DownloadedVideo } from "@prisma/client";
import { downloadTwitchVideo } from "./platforms/download-twitch-video";
import { downloadYoutubeVideo } from "./platforms/download-youtube-video";
import { DownloadVideoOptions } from "../../types/DownloadVideo.type";

export async function downloadRange(url: string, options?: DownloadVideoOptions):Promise<DownloadedVideo> {
    let video:DownloadedVideo;
    if (url.includes('twitch')) {
        video = await downloadTwitchVideo(url,options)
    }
    else if (url.includes('youtube') || url.includes('youtu.be')) {
        video = await downloadYoutubeVideo(url,options)
    }
    else {
        throw new Error('Invalid URL')
    }
    return video
}