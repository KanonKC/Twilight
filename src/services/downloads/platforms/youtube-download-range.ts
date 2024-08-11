import { exec } from "child_process";
import { Model } from "sequelize";
import { generateRandomString } from "../../../utilities/String";
import { getYoutubeVideoKey } from "../../../utilities/Url";
import { configDotenv } from "dotenv";
import { DownloadedVideo } from "@prisma/client";
import { prisma } from "../../..";

configDotenv();

export async function youtubeDownloadRange(url:string, start?:string, end?:string):Promise<DownloadedVideo> {
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
					const result = await prisma.downloadedVideo.create({
						data: {
							filename: filename,
							platform: "Youtube",
							platformId: videoKey,
						}
					});

					resolve(result)
				}
			}
		);
	});
}