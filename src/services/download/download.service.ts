import { DownloadedVideo } from "@prisma/client";
import FFmpeg from "../../externals/ffmpeg/ffmpeg";
import TwitchDl from "../../externals/twitch-dl/twitch-dl";
import YtDlp from "../../externals/yt-dlp/yt-dlp";
import { prisma } from "../../prisma";
import { DownloadVideoOptions, ExtendedDownloadedVideo } from "../../types/DownloadVideo.type";
import { convertHHMMSSStringToSeconds } from "../../utilities/Time";
import { VideoProfile } from "./response";
import { Config } from "../../configs";
import { existsSync } from "fs";

export default class DownloadService {
	private ffmpeg: FFmpeg;
	private twitchDl: TwitchDl;
	private ytDlp: YtDlp;
	private config: Config;

	constructor(
		twitchDl: TwitchDl,
		ffmpeg: FFmpeg,
		ytDlp: YtDlp,
		config: Config
	) {
		this.ffmpeg = ffmpeg;
		this.twitchDl = twitchDl;
		this.ytDlp = ytDlp;
		this.config = config;
	}

    // T1
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

    // T2
	async downloadTwitchVideo(
		url: string,
		options?: DownloadVideoOptions
	): Promise<DownloadedVideo> {
		const video = await this.twitchDl.downloadTwitchVideo(url, options);
        console.log("[Download-Service] Twitch Video downloaded. Generating profile ...")
		const profile = await this.generateVideoProfile(
			video.filename,
			options
		);
        console.log("[Download-Service] Profile generated. Creating database entry ...")

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

    // T2
	async downloadYoutubeVideo(
		url: string,
		options?: DownloadVideoOptions
	): Promise<DownloadedVideo> {
		const video = await this.ytDlp.downloadYoutubeVideo(url, options);
        console.log("[Download-Service] Youtube Video downloaded. Generating profile ...")
		const profile = await this.generateVideoProfile(
			video.filename,
			options
		);
        console.log("[Download-Service] Profile generated. Creating database entry ...")

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

    // T1
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

    // T3
	async downloadRange(
		url: string,
		options?: DownloadVideoOptions
	): Promise<DownloadedVideo> {
		let video: DownloadedVideo | null = null;

		if (url.startsWith("https://")) {
			if (url.includes("twitch")) {
                console.log("[Download-Service] Downloading Twitch Video")
				video = await this.downloadTwitchVideo(url, options);
			} else if (url.includes("youtube") || url.includes("youtu.be")) {
                console.log("[Download-Service] Downloading Youtube Video")
				video = await this.downloadYoutubeVideo(url, options);
			}
		} else {
            console.log("[Download-Service] Try to get local video")
			video = await this.getLocalVideo(url);
		}

		if (!video) {
            console.log("[Download-Service] Video not found in database, try to import local video")
			video = await this.importLocalVideo(url)
		}
        if (!video) {
            throw new Error("Video not found")
        }
        console.log("[Download-Service] Download / Get video success.")
		return video;
	}

    // T1
    extendDownloadedVideoData(downloadedVideo: DownloadedVideo): ExtendedDownloadedVideo {
        return {
            ...downloadedVideo,
            durationMilliseconds: downloadedVideo.duration * 1000
        }
    }

    async importLocalVideo(filename: string): Promise<DownloadedVideo | null> {
        if (!existsSync(process.env.VIDEO_STORAGE_PATH + "/" + filename)) {
            return null
        }
        console.log("[Download-Service] Video found in local storage. Generating profile ...")
        const profile = await this.generateVideoProfile(filename)
        console.log("[Download-Service] Profile generated. Creating database entry ...")
        return prisma.downloadedVideo.create({
            data: {
                title: profile.filename,
                filename: profile.filename,
                url: filename,
                platform: "Local",
                platformId: filename,
                width: profile.width,
                height: profile.height,
                duration: profile.duration,
            }
        })
    }
}
