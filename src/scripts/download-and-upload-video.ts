import { ConcatenatedVideo, DownloadedVideo } from "@prisma/client";
import { Config } from "../configs";
import FFmpeg from "../externals/ffmpeg/ffmpeg";
import Python from "../externals/python/python";
import TwitchDl from "../externals/twitch-dl/twitch-dl";
import YtDlp from "../externals/yt-dlp/yt-dlp";
import ConcatenatedService from "../services/concatenated/concatenated.service";
import DownloadService from "../services/download/download.service";
import UploadService from "../services/upload/upload.service";
import { YoutubeUploadVideoDetail } from "../types/Youtube.type";
import { convertSecondsToHHMMSSString } from "../utilities/Time";

interface SourceVideoHighlight {
	url: string;
	highlights: {
		start: string;
		end: string;
	}[];
}

interface Highlight {
	start: string;
	end: string;
}

export interface DownloadAndUploadVideoRequest {
	sources: {
		url: string;
		resolution?: { width: number; height: number };
		highlights?: Highlight[];
		autoHighlights?: boolean;
		autoHighlightsThreshold?: number;
		forceDownload?: boolean;
	}[];
	concat?: boolean;
	youtube?: YoutubeUploadVideoDetail | null | undefined;
}

interface DownloadedVideoHighlight {
	start: string;
	end: string;
	downloadVideo: DownloadedVideo;
}

interface DownloadAndUploadVideoResponse {
	sources: DownloadedVideo[];
	concatVideo: ConcatenatedVideo | null;
	youtubeVideoId: string | null;
}


export default class DownloadAndUploadVideoScript {
	private twitchDl: TwitchDl;
	private ffmpeg: FFmpeg;
	private ytDlp: YtDlp;
	private python: Python;
	private ds: DownloadService;
	private cs: ConcatenatedService;
	private us: UploadService;

	constructor(config: Config) {
		this.twitchDl = new TwitchDl();
		this.ffmpeg = new FFmpeg(config);
		this.ytDlp = new YtDlp();
		this.python = new Python();
		this.ds = new DownloadService(
			this.twitchDl,
			this.ffmpeg,
			this.ytDlp,
			config
		);
		this.cs = new ConcatenatedService(config);
		this.us = new UploadService(this.python);
	}

	async do(
		payload: DownloadAndUploadVideoRequest
	): Promise<DownloadAndUploadVideoResponse> {
		const response: DownloadAndUploadVideoResponse = {
			sources: [],
			concatVideo: null,
			youtubeVideoId: null,
		};

		const highlightFilenames: string[] = [];
		let totalHighlights = 0;

		for (const source of payload.sources) {
			console.log(`[Twilight] Start downloading ${source.url} ...`);
			const sourceResponse: {
				url: string;
				highlights: DownloadedVideoHighlight[];
			} = {
				url: source.url,
				highlights: [],
			};

			let video: DownloadedVideo | null = null;

			if (source.autoHighlights) {
				console.log(
					`[Twilight] Auto-highlight is enabled, begin download a whole video ...`
				);
				video = await this.ds.downloadRange(source.url, {
					resolution: source.resolution,
				});
				console.log(
					`[Twilight] Download video success! (${video.filename})`
				);

				console.log(`[Twilight] Detecting audio spikes ...`);
				const audioSpike = await this.python.getAudioSpike(
					`${process.env.VIDEO_STORAGE_PATH}/${video.filename}`,
					{ threshold: source.autoHighlightsThreshold ?? 0.6 }
				);
				console.log(
					`[Twilight] Found total ${audioSpike.length} Audio spikes.`
				);

				for (let i = 0; i < audioSpike.length; i++) {
					console.log(
						`[Twilight] Download slice of video (${i + 1}/${
							audioSpike.length
						}) ...`
					);
					let startTime = audioSpike[i] - 30;
					if (startTime < 0) {
						startTime = 0;
					}
					let endTime = audioSpike[i] + 30;
					if (endTime > video.duration) {
						endTime = video.duration;
					}
					const trimmedVideo = await this.ffmpeg.trimVideo(
						video,
						startTime,
						endTime
					);
					sourceResponse.highlights.push({
						start: convertSecondsToHHMMSSString(startTime),
						end: convertSecondsToHHMMSSString(endTime),
						downloadVideo: trimmedVideo.editedVideo,
					});
					highlightFilenames.push(trimmedVideo.editedVideo.filename);
					response.sources.push(
						this.ds.extendDownloadedVideoData(
							trimmedVideo.editedVideo
						)
					);
				}

				totalHighlights += audioSpike.length;
			}

			if (source.highlights && source.highlights.length > 0) {
				let count = 1;
				for (const highlight of source.highlights) {
					console.log(
						`[Twilight] Download slice of video (${count}/${source.highlights.length}) ...`
					);
					const downloadedHighlight = await this.ds.downloadRange(
						source.url,
						{
							range: {
								start: highlight.start,
								end: highlight.end,
							},
							resolution: source.resolution,
						}
					);
					sourceResponse.highlights.push({
						start: highlight.start,
						end: highlight.end,
						downloadVideo: downloadedHighlight,
					});
					highlightFilenames.push(downloadedHighlight.filename);
					response.sources.push(
						this.ds.extendDownloadedVideoData(downloadedHighlight)
					);
					count++;
				}

				totalHighlights += source.highlights.length;
			}

			if (
				!(source.highlights && source.highlights.length > 0) &&
				!source.autoHighlights
			) {
				const video = await this.ds.downloadRange(source.url, {
					resolution: source.resolution,
				});
				highlightFilenames.push(video.filename);
				response.sources.push(this.ds.extendDownloadedVideoData(video));
			}
			console.log(
				`[Twilight] ${totalHighlights} highlights successfully downloaded!`
			);
		}

		if (payload.concat || payload.youtube) {
			console.log(
				`[Twilight] Concatenating ${highlightFilenames.length} highlights into one video ...`
			);
			const concatVideo = await this.cs.concatVideos(
				highlightFilenames,
				undefined
			);
			console.log(
				`[Twilight] Successfully create video (${concatVideo.filename})`
			);
			response.concatVideo = concatVideo;

			if (payload.youtube) {
				console.log(`[Twilight] Upload video to YouTube ...`);
				const youtubeUploadResponse = await this.us.uploadYoutubeVideo(
					`${process.env.VIDEO_STORAGE_PATH}/${concatVideo.filename}`,
					payload.youtube
				);
				response.youtubeVideoId = youtubeUploadResponse.videoId;
			}
		}

		return response;
	}
}
