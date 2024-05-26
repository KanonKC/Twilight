// twitch-dl download https://www.twitch.tv/kanonkc/clip/RefinedBlatantWoodcockPartyTime-5Z3UtcRwvm-dO4s3 -q source

import { exec } from "child_process";
import { Model } from "sequelize";
import { DownloadVideoAttribute, DownloadVideoModel } from "../models/DownloadedVideo.model";
import { generateRandomString } from "../utilities/RandomString";
import { getTwitchVideoInfo } from "./twitch-info";

export async function twitchDownload(url:string):Promise<Model<DownloadVideoAttribute, DownloadVideoAttribute>> {
    console.log("Downloading video ...")

    const videoInfo = await getTwitchVideoInfo(url)
    const randomString = generateRandomString(4)
    const id = `twitch_${videoInfo.id}_${randomString}`
    const filename = `${id}.mp4`

    return new Promise((resolve, reject) => {
		exec(
			`twitch-dl download ${url} -q source --overwrite -o src/dumps/${filename}`,
			async (error, stdout, stderr) => {
				if (error) {
					console.warn(error);
				}
				if (stdout) {
                    console.log(stdout)
                    const result = await DownloadVideoModel.create({
                        id: id,
                        title: videoInfo.title,
                        filename: filename,
                        platform: "Twitch",
                        platformId: videoInfo.id,
                    })
					resolve(result)
				}
				else {
                    throw new Error(stderr);
					// reject()
				}
			}
		);
	});
}