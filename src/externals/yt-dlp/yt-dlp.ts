import { exec } from "child_process";
import {
    DownloadVideoOptions
} from "../../types/DownloadVideo.type";
import { generateRandomString } from "../../utilities/String";
import { convertHHMMSSStringToSeconds } from "../../utilities/Time";
import { getYoutubeVideoKey } from "../../utilities/Url";
import { DownloadYoutubeVideo } from "./response";

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
        let fileType = ".mp4";

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
		const path = options?.path || process.env.VIDEO_STORAGE_PATH || "./";
		const videoInfo = await this.getYoutubeVideoData(url);
		// const baseCommand = `yt-dlp --paths "./${path}" -f "bestvideo+bestaudio[ext=mp4]/best" --merge-output-format mp4`
		// const baseCommand = `yt-dlp --cookies-from-browser firefox --paths "./${path}" -f "bestvideo+bestaudio[ext=mp4]/best" --merge-output-format mp4`
		// Claude-4: const baseCommand = `yt-dlp --cookies-from-browser firefox --paths "./${path}" -f "bestvideo[height=1080][fps=60]+bestaudio[ext=mp4]/bestvideo[height=1080]+bestaudio[ext=mp4]/best" --merge-output-format mp4`

		command = `yt-dlp --cookies-from-browser firefox --paths "./${path}"`;

        if (!options?.audioOnly) {
            command = `${command} --merge-output-format ${fileType.slice(1)}`;
        } else {
            fileType = "";
            command = `${command} -x`;
        }

		if (start && end) {
			const startText = start.split(":").join("_");
			const endText = end.split(":").join("_");
			filename = `youtube_${videoKey}_range_${startText}-${endText}_${generateRandomString(
				4
			)}${fileType}`;
			command = `${command} --download-sections "*${start}-${end}" `;
			timeRange = {
				startTime: convertHHMMSSStringToSeconds(start),
				endTime: convertHHMMSSStringToSeconds(end),
			};
		} else {
			filename = `youtube_${videoKey}_${generateRandomString(4)}${fileType}`;
		}

		if (options?.ipv4) {
			command = `${command} -4`;
		}

		command = `${command} "${videoKey}" -o "${filename}"`;

		console.log(
			"[Yt-Dlp] Downloading Youtube Video with command: ",
			command
		);

		return new Promise((resolve, reject) => {
			exec(command, async (error) => {
				if (error) {
					reject(error);
				} else {
                    if (options?.audioOnly) {
                        filename = filename + ".opus";
                    }
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
