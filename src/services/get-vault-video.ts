import { Model } from "sequelize";
import { DownloadVideoModel } from "../models/models";
import { DownloadVideoAttribute } from "../models/types";
import { getTwitchVideoInfo } from "./twitch-info";

export async function getVaultVideo(url:string):Promise<Model<DownloadVideoAttribute, DownloadVideoAttribute> | null>{

    if (url.includes("youtube")) {
        const prefixId = url.split("v=")[1];
        return DownloadVideoModel.findOne({
            where: {
                platform: "Youtube",
                platformId: prefixId
            }
        })
    }
    else if (url.includes("twitch")) {
        const data = await getTwitchVideoInfo(url)
        return DownloadVideoModel.findOne({
            where: {
                platform: "Twitch",
                platformId: data.id
            }
        })
    }

    return null
}