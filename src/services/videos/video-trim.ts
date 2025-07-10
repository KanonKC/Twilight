import { exec } from "child_process";

import {
	convertHHMMSSStringToSeconds,
	convertSecondsToHHMMSSString,
} from "../../utilities/Time";
import { DownloadedVideo } from "@prisma/client";
import { VideoTrimResult } from "../../types/DownloadVideo.type";
import { generateRandomString } from "../../utilities/String";

export async function videoTrim(
	video: DownloadedVideo,
	start: string | number,
	end: string | number
): Promise<VideoTrimResult> {
	let startTime = "00:00:00";
	let endTime = "00:00:00";

	if (typeof start === "string") {
		startTime = start;
	} else {
		startTime = convertSecondsToHHMMSSString(start);
	}

	if (typeof end === "string") {
		endTime = end;
	} else {
		endTime = convertSecondsToHHMMSSString(end);
	}

	const randomString = generateRandomString(6);
	const outputFilename = `trimmed_${video.platformId}_${randomString}.mp4`;

	return new Promise((resolve, reject) => {
		exec(
			`ffmpeg -ss ${startTime} -to ${endTime} -i ${process.env.VIDEO_STORAGE_PATH}/${video.filename} -c copy ${process.env.VIDEO_STORAGE_PATH}/${outputFilename}`,
			(error) => {
				if (error) {
					console.warn(error);
				}
				resolve({
					originalVideo: video,
					editedVideo: {
						...video,
						filename: outputFilename,
					},
					start: convertHHMMSSStringToSeconds(startTime),
					end: convertHHMMSSStringToSeconds(endTime),
				});
			}
		);
	});
}
