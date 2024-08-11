import { Model } from "sequelize";
import { getTwitchVideoInfo } from "../downloads/platforms/twitch-info";
import { prisma } from "../..";
import { DownloadedVideo } from "@prisma/client";

export async function getVaultVideo(url:string):Promise<DownloadedVideo | null>{

    if (url.includes("youtube")) {
        const prefixId = url.split("v=")[1];
        return prisma.downloadedVideo.findFirst({
            where: {
                platform: "Youtube",
                platformId: prefixId
            }
        })
    }
    else if (url.includes("twitch")) {
        const data = await getTwitchVideoInfo(url)
        return prisma.downloadedVideo.findFirst({
            where: {
                platform: "Twitch",
                platformId: data.id
            }
        })
    }

    return null
}