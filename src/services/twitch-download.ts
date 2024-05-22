// twitch-dl download https://www.twitch.tv/kanonkc/clip/RefinedBlatantWoodcockPartyTime-5Z3UtcRwvm-dO4s3 -q source

import { exec } from "child_process";
import { DownloadedVideo } from "../types/Video";
import { getTwitchVideoInfo } from "./twitch-info";
import { generateRandomString } from "../utilities/RandomString";

export async function twitchDownload(url:string):Promise<DownloadedVideo> {
    console.log("Downloading video ...")

    const videoInfo = await getTwitchVideoInfo(url)
    const randomString = generateRandomString(4)
    const id = `twitch_${videoInfo.id}_${randomString}`
    const filename = `${id}.mp4`

    return new Promise((resolve, reject) => {
		exec(
			`twitch-dl download ${url} -q source --overwrite -o src/dumps/${filename}`,
			(error, stdout, stderr) => {
				if (error) {
					console.warn(error);
				}
				if (stdout) {
                    console.log(stdout)
					resolve({
                        id: id,
                        filaneme: filename,
                        platform: {
                            name: "Twitch",
                            id: videoInfo.id,
                        },
                        title: videoInfo.title,
                    })
				}
				else {
                    throw new Error(stderr);
					// reject()
				}
			}
		);
	});
}