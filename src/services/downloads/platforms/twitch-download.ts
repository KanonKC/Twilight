// // twitch-dl download https://www.twitch.tv/kanonkc/clip/RefinedBlatantWoodcockPartyTime-5Z3UtcRwvm-dO4s3 -q source

// import { exec } from "child_process";
// import { Model } from "sequelize";
// import { DownloadVideoModel } from "../models/models";
// import { DownloadVideo } from "../models/types";
// import { getTwitchVideoInfo } from "./twitch-info";
// import { generateRandomString } from "../utilities/String";

// export async function twitchDownload(url:string):Promise<Model<DownloadVideo, DownloadVideo>> {
//     console.log("Downloading video ...")

//     const videoInfo = await getTwitchVideoInfo(url)
//     const randomString = generateRandomString(4)
//     const id = `twitch_${videoInfo.id}_${randomString}`
//     const filename = `${id}.mp4`

//     return new Promise((resolve, reject) => {
// 		exec(
// 			`twitch-dl download ${url} -q source --overwrite -o ${process.env.VIDEO_STORAGE_PATH}/${filename}`,
// 			async (error, stdout, stderr) => {
// 				if (error) {
// 					console.warn(error);
// 				}
// 				if (stdout) {
//                     console.log(stdout)
//                     const result = await DownloadVideoModel.create({
//                         id: id,
//                         title: videoInfo.title,
//                         filename: filename,
//                         platform: "Twitch",
//                         platformId: videoInfo.id,
//                     })
// 					resolve(result)
// 				}
// 				else {
//                     throw new Error(stderr);
// 					// reject()
// 				}
// 			}
// 		);
// 	});
// }