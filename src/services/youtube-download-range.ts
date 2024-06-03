import { exec } from "child_process";
import { DownloadVideoModel } from "../models/models";
import { DownloadVideoAttribute } from "../models/types";
import { Model } from "sequelize";
import { generateRandomString } from "../utilities/String";
import { getYoutubeVideoKey } from "../utilities/Url";
import { configDotenv } from "dotenv";

configDotenv();

export async function youtubeDownloadRange(url:string, start:string, end:string):Promise<Model<DownloadVideoAttribute, DownloadVideoAttribute>> {
	const videoKey = getYoutubeVideoKey(url);
	const startText = start.split(':').join("_");
	const endText = end.split(':').join("_");
	const filename = `youtube_${videoKey}_range_${startText}-${endText}_${generateRandomString(4)}`;
	return new Promise((resolve, reject) => {
		exec(
			`yt-dlp --cookies-from-browser firefox --paths "./src/dumps" -f "bestvideo+bestaudio[ext=mp4]/best" --download-sections "*${start}-${end}" "${url}" -o "${filename}"`,
			async (error, stdout, stderr) => {
				if (error) {
					console.warn(error);
				}
				if (stdout) {

					const result = await DownloadVideoModel.create({
						id: filename,
						title: "empty",
						filename: `${filename}.mp4`,
						platform: "Youtube",
						platformId: videoKey,
					});

					console.log(stdout)

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