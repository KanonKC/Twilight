import { exec } from "child_process";
import { generateRandomString } from "../../utilities/String";
import { convertHHMMSSStringToSeconds } from "../../utilities/Time";
import { DownloadVideoOptions } from "../../types/DownloadVideo.type";

export default class TwitchDl {

    constructor() {}

	async downloadTwitchVideo(
		url: string,
		options?: DownloadVideoOptions
	): Promise<DownloadTwitchVideo> {
		let start: string | undefined;
		let end: string | undefined;
		let width: number | undefined;
		let height: number | undefined;

		if (options) {
			if (options.range) {
				start = options.range.start;
				end = options.range.end;
			}
			if (options.resolution) {
				width = options.resolution.width;
				height = options.resolution.height;
			}
		}

		// TODO:Don't forget to fix this
		const videoInfo = {
			id: generateRandomString(10),
			title: undefined,
		};

		let videoId: string;
		let filename: string;
		let command: string;
		let timeRange = {};

		if (start && end) {
			const startText = start.split(":").join("_");
			const endText = end.split(":").join("_");
			videoId = `twitch_${
				videoInfo.id
			}_range_${startText}-${endText}_${generateRandomString(4)}`;
			filename = `${videoId}.mp4`;
			command = `twitch-dl download ${url} -q source --start ${start} --end ${end} --overwrite -o ${process.env.VIDEO_STORAGE_PATH}/${filename}`;
			timeRange = {
				startTime: convertHHMMSSStringToSeconds(start),
				endTime: convertHHMMSSStringToSeconds(end),
			};
		} else {
			videoId = `twitch_${videoInfo.id}_${generateRandomString(4)}`;
			filename = `${videoId}.mp4`;
			command = `twitch-dl download ${url} -q source --overwrite -o ${process.env.VIDEO_STORAGE_PATH}/${filename}`;
		}

		return new Promise((resolve, reject) => {
			exec(command, async (error, _, stderr) => {
				if (error) {
					reject(error);
				}
				if (stderr) {
					reject(stderr);
				}

				try {
					resolve({
						id: videoInfo.id,
						title: videoInfo.title,
						filename: filename,
					});
				} catch (error) {
					reject(error);
				}
			});
		});
	}
}
