import { exec } from "child_process";
import { Config } from "../../configs";
import {
	DownloadVideoOptions,
	YoutubeVideo,
} from "../../types/DownloadVideo.type";
import { getYoutubeVideoKey } from "../../utilities/Url";
import { generateRandomString } from "../../utilities/String";
import { convertHHMMSSStringToSeconds } from "../../utilities/Time";

export default class YtDlp {
	constructor() {}

	async getYoutubeVideoData(url: string): Promise<string> {
		return new Promise((resolve, reject) => {
			exec(
				`yt-dlp --cookies-from-browser firefox --get-title ${url}`,
				(error, stdout, stderr) => {
					if (error) {
						console.warn(error);
					}
					if (stdout) {
						resolve(stdout.slice(0, stdout.length - 1));
					} else {
						reject(stderr);
					}
				}
			);
		});
	}

	async downloadYoutubeVideo(
		url: string,
		options?: DownloadVideoOptions
	): Promise<DownloadYoutubeVideo> {
		const videoKey = getYoutubeVideoKey(url);

		let filename: string;
		let command: string;
		let timeRange = {};

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

		const videoInfo = await this.getYoutubeVideoData(url);
		// const baseCommand = `yt-dlp --paths "./${process.env.VIDEO_STORAGE_PATH}" -f "bestvideo+bestaudio[ext=mp4]/best" --merge-output-format mp4`
		// const baseCommand = `yt-dlp --cookies-from-browser firefox --paths "./${process.env.VIDEO_STORAGE_PATH}" -f "bestvideo+bestaudio[ext=mp4]/best" --merge-output-format mp4`
		const baseCommand = `yt-dlp --cookies-from-browser firefox --paths "./${process.env.VIDEO_STORAGE_PATH}" --merge-output-format mp4`;

		if (start && end) {
			const startText = start.split(":").join("_");
			const endText = end.split(":").join("_");
			filename = `youtube_${videoKey}_range_${startText}-${endText}_${generateRandomString(
				4
			)}.mp4`;
			command = `${baseCommand} --download-sections "*${start}-${end}" "${videoKey}" -o "${filename}"`;
			timeRange = {
				startTime: convertHHMMSSStringToSeconds(start),
				endTime: convertHHMMSSStringToSeconds(end),
			};
		} else {
			filename = `youtube_${videoKey}_${generateRandomString(4)}.mp4`;
			command = `${baseCommand} "${videoKey}" -o "${filename}"`;
		}

		if (true) {
			// TODO: Handle IPv4 options flag
			command = `${command} -4`;
		}

		return new Promise((resolve, reject) => {
			exec(command, async (error) => {
				if (error) {
					reject(error);
				} else {
					resolve({
						id: videoKey,
						title: videoInfo,
						filename: filename,
					});
				}
			});
		});
	}
}
