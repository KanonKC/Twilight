import { DownloadedVideo } from "@prisma/client";
import { downloadTwitchVideo } from "./platforms/download-twitch-video";
import { downloadYoutubeVideo } from "./platforms/download-youtube-video";

export async function downloadRange(url: string, start?: string, end?: string):Promise<DownloadedVideo> {
    let video:DownloadedVideo;
    if (url.includes('twitch')) {
        video = await downloadTwitchVideo(url,start,end)
    }
    else if (url.includes('youtube') || url.includes('youtu.be')) {
        video = await downloadYoutubeVideo(url,start,end)
    }
    else {
        throw new Error('Invalid URL')
    }
    return video
}