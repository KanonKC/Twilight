import { exec } from "child_process";
import { Model } from "sequelize";
import { generateRandomString } from "../../../utilities/String";
import { getYoutubeVideoKey } from "../../../utilities/Url";
import { configDotenv } from "dotenv";
import { DownloadedVideo } from "@prisma/client";
import { prisma } from "../../../prisma";
import { getYoutubeVideoData } from "./get-youtube-video-data";
import { getVideoDuration } from "../../videos/get-video-duration";
import { convertHHMMSSStringToSeconds } from "../../../utilities/Time";

configDotenv();

export async function downloadYoutubeVideo(url:string, start?:string, end?:string):Promise<DownloadedVideo> {
	const videoKey = getYoutubeVideoKey(url);

	let filename:string;
	let command:string;
    let timeRange = {}

	const videoInfo = await getYoutubeVideoData(url);
	
	if (start && end) {
		const startText = start.split(':').join("_");
		const endText = end.split(':').join("_");
		filename = `youtube_${videoKey}_range_${startText}-${endText}_${generateRandomString(4)}.mp4`;
		command = `yt-dlp --cookies-from-browser firefox --paths "./${process.env.VIDEO_STORAGE_PATH}" -f "bestvideo+bestaudio[ext=mp4]/best" --merge-output-format mp4 --download-sections "*${start}-${end}" "${videoKey}" -o "${filename}"`
        timeRange = {startTime: convertHHMMSSStringToSeconds(start), endTime: convertHHMMSSStringToSeconds(end)}
    }
	else {
		filename = `youtube_${videoKey}_${generateRandomString(4)}.mp4`;
		command = `yt-dlp --cookies-from-browser firefox --paths "./${process.env.VIDEO_STORAGE_PATH}" -f "bestvideo+bestaudio[ext=mp4]/best" --merge-output-format mp4 "${videoKey}" -o "${filename}"`
	}

	return new Promise((resolve, reject) => {
		exec(
			command,
			async (error, stdout, stderr) => {
				if (error) {
					reject(error)
				}
				else {

                    const duration = await getVideoDuration(filename)

					const result = await prisma.downloadedVideo.create({
						data: {
							title: videoInfo.title,
							filename: filename,
                            url: url,
                            duration: duration,
							platform: "Youtube",
							platformId: videoKey,
                            ...timeRange
						}
					});

					resolve(result)
				}
			}
		);
	});
}