import { exec } from "child_process";
import { DownloadVideoModel } from "../models/models";
import { DownloadVideoAttribute } from "../models/types";
import { Model } from "sequelize";
import { generateRandomString } from "../utilities/String";
import { getYoutubeVideoKey } from "../utilities/Url";
import { configDotenv } from "dotenv";

configDotenv();

export async function youtubeDownloadRange(url:string, start?:string, end?:string):Promise<Model<DownloadVideoAttribute, DownloadVideoAttribute>> {
	const videoKey = getYoutubeVideoKey(url);

	let filename:string;
	let command:string;
	
	if (start && end) {
		const startText = start.split(':').join("_");
		const endText = end.split(':').join("_");
		filename = `youtube_${videoKey}_range_${startText}-${endText}_${generateRandomString(4)}`;
		command = `yt-dlp --cookies-from-browser firefox --paths "./src/dumps" -f "bestvideo+bestaudio[ext=mp4]/best" --merge-output-format mp4 --download-sections "*${start}-${end}" "${videoKey}" -o "${filename}"`
	}
	else {
		filename = `youtube_${videoKey}_${generateRandomString(4)}`;
		command = `yt-dlp --cookies-from-browser firefox --paths "./src/dumps" -f "bestvideo+bestaudio[ext=mp4]/best" --merge-output-format mp4 "${videoKey}" -o "${filename}"`
	}

	return new Promise((resolve, reject) => {
		exec(
			command,
			async (error, stdout, stderr) => {
				if (error) {
					reject(error)
				}
				else {
					const result = await DownloadVideoModel.create({
						id: filename,
						title: "empty",
						filename: `${filename}.mp4`,
						platform: "Youtube",
						platformId: videoKey,
					});

					resolve(result)
				}
			}
		);
	});
}