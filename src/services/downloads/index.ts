import { DownloadedVideo } from "@prisma/client";
import { downloadTwitchVideo } from "./platforms/download-twitch-video";
import { downloadYoutubeVideo } from "./platforms/download-youtube-video";
import { DownloadVideoOptions } from "../../types/DownloadVideo.type";
import { getVaultVideo } from "../videos/get-vault-video";

export async function downloadRange(url: string, options?: DownloadVideoOptions):Promise<DownloadedVideo> {
    let video:DownloadedVideo | null = null;
    
    if (url.startsWith('https://')) {
        if (url.includes('twitch')) {
            video = await downloadTwitchVideo(url,options)
        }
        else if (url.includes('youtube') || url.includes('youtu.be')) {
            video = await downloadYoutubeVideo(url,options)
        }
    }
    else {
        video = await getVaultVideo(url)
    }

    if (!video) {
        throw new Error('Invalid URL')
    }
    return video
}