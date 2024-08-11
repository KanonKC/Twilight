import { DownloadedVideo } from "@prisma/client";
import { twitchDownloadRange } from "./platforms/twitch-download-range";
import { youtubeDownloadRange } from "./platforms/youtube-download-range";

export async function downloadRange(url: string, start?: string, end?: string):Promise<DownloadedVideo> {
    let video:DownloadedVideo;
    if (url.includes('twitch')) {
        video = await twitchDownloadRange(url,start,end)
    }
    else if (url.includes('youtube') || url.includes('youtu.be')) {
        video = await youtubeDownloadRange(url,start,end)
    }
    else {
        throw new Error('Invalid URL')
    }
    return video
}