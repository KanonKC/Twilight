import { DownloadedVideo } from "@prisma/client";
import FFmpeg from "../../externals/ffmpeg/ffmpeg";
import TwitchDl from "../../externals/twitch-dl/twitch-dl";
import YtDlp from "../../externals/yt-dlp/yt-dlp";
import { prisma } from "../../prisma";
import { DownloadVideoOptions } from "../../types/DownloadVideo.type";
import { convertHHMMSSStringToSeconds } from "../../utilities/Time";
import { VideoProfile } from "./response";
import { Config } from "../../configs";

export default class DownloadService {
	private ffmpeg: FFmpeg;
	private twitchDl: TwitchDl;
	private ytDlp: YtDlp;
	private config: Config;

	constructor(twitchDl: TwitchDl, ffmpeg: FFmpeg, ytDlp: YtDlp, config: Config) {
		this.ffmpeg = ffmpeg;
		this.twitchDl = twitchDl;
		this.ytDlp = ytDlp;
		this.config = config;
	}

	async generateVideoProfile(
		filename: string,
		options?: DownloadVideoOptions
	): Promise<VideoProfile> {
		const duration = await this.ffmpeg.getVideoDuration(filename);
		const resolution = await this.ffmpeg.getVideoResolution(filename);

		let profileWidth = resolution.width;
		let profileHeight = resolution.height;

		if (options?.resolution) {
			if (
				resolution.width !== options.resolution.width ||
				resolution.height !== options.resolution.height
			) {
				const resizedFilename = await this.ffmpeg.resizeVideo(
					filename,
					options.resolution.width,
					options.resolution.height
				);
				profileWidth = options.resolution.width;
				profileHeight = options.resolution.height;
				filename = resizedFilename.filename;
			}
		}

		return {
			width: profileWidth,
			height: profileHeight,
			duration: duration,
			filename: filename,
		};
	}

	async downloadTwitchVideo(url: string, options?: DownloadVideoOptions): Promise<DownloadedVideo> {
		const video = await this.twitchDl.downloadTwitchVideo(url, options);
		const profile = await this.generateVideoProfile(
			video.filename,
			options
		);

		const result = await prisma.downloadedVideo.create({
			data: {
				title: video.title ?? video.filename,
				filename: video.filename,
				url: url,
				duration: profile.duration,
				platform: "Twitch",
				platformId: video.id,
				width: profile.width,
				height: profile.height,
				...(options?.range
					? {
							startTime: convertHHMMSSStringToSeconds(
								options.range.start
							),
							endTime: convertHHMMSSStringToSeconds(
								options.range.end
							),
					  }
					: {}),
			},
		});

		return result;
	}

	async downloadYoutubeVideo(url: string, options?: DownloadVideoOptions): Promise<DownloadedVideo> {
		const video = await this.ytDlp.downloadYoutubeVideo(url, options);
		const profile = await this.generateVideoProfile(
			video.filename,
			options
		);

		const result = await prisma.downloadedVideo.create({
			data: {
				title: video.title ?? video.filename,
				filename: video.filename,
				url: url,
				duration: profile.duration,
				platform: "Youtube",
				platformId: video.id,
				width: profile.width,
				height: profile.height,
				...(options?.range
					? {
							startTime: convertHHMMSSStringToSeconds(
								options.range.start
							),
							endTime: convertHHMMSSStringToSeconds(
								options.range.end
							),
					  }
					: {}),
			},
		});

		return result;
	}

    async getLocalVideo(url: string): Promise<DownloadedVideo | null> {
		if (url.startsWith("https://")) {
			if (url.includes("youtube")) {
				const prefixId = url.split("v=")[1];
				return prisma.downloadedVideo.findFirst({
					where: {
						platform: "Youtube",
						platformId: prefixId,
					},
				});
			} else if (url.includes("twitch")) {
				const data = await this.twitchDl.getTwitchVideoData(url);
				return prisma.downloadedVideo.findFirst({
					where: {
						platform: "Twitch",
						platformId: data.id,
					},
				});
			}
		} else {
			let video = await prisma.downloadedVideo.findFirst({
				where: {
					filename: url,
				},
			});

			if (!video) {
				video = await prisma.downloadedVideo.findFirst({
					where: {
						filename: url.slice(
							this.config.VideoStoragePath.length + 1
						),
					},
				});
			}

			return video;
		}

		return null;
	}
}
