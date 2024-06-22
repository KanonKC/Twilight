import { Model } from "sequelize";
import { DownloadVideoAttribute } from "../models/types";
import { twitchDownloadRange } from "./twitch-download-range";
import { youtubeDownloadRange } from "./youtube-download-range";

export async function downloadRange(url: string, start?: string, end?: string):Promise<Model<DownloadVideoAttribute, DownloadVideoAttribute>> {
    let video:Model<DownloadVideoAttribute, DownloadVideoAttribute>;
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