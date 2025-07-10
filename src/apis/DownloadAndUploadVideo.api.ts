import { ConcatenatedVideo, DownloadedVideo } from "@prisma/client";
import { downloadRange } from "../services/downloads";
import { videoConcat } from "../services/videos/video-concat";
import { YoutubeUploadVideoDetail } from "../types/Youtube.type";
import { youtubeUpload } from "../services/uploads/youtube-upload";
import { configDotenv } from "dotenv";
import { extendDownloadedVideoData } from "../utilities/Video";
import { getAudioSpike } from "../services/videos/get-audio-spike";
import {
	convertHHMMSSStringToSeconds,
	convertSecondsToHHMMSSString,
} from "../utilities/Time";
import { videoTrim } from "../services/videos/video-trim";

configDotenv();

export interface SourceVideoHighlight {
	url: string;
	highlights: {
		start: string;
		end: string;
	}[];
}

export interface Highlight {
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

export interface DownloadedVideoHighlight {
	start: string;
	end: string;
	downloadVideo: DownloadedVideo;
}

export interface DownloadAndUploadVideoResponse {
	sources: DownloadedVideo[];
	concatVideo: ConcatenatedVideo | null;
	youtubeVideoId: string | null;
}

export async function downloadAndUploadVideoAPI(
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
			video = await downloadRange(source.url, {
				resolution: source.resolution,
			});
			console.log(
				`[Twilight] Download video success! (${video.filename})`
			);

			console.log(`[Twilight] Detecting audio spikes ...`);
			const audioSpike = await getAudioSpike(
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
				const trimmedVideo = await videoTrim(video, startTime, endTime);
				sourceResponse.highlights.push({
					start: convertSecondsToHHMMSSString(startTime),
					end: convertSecondsToHHMMSSString(endTime),
					downloadVideo: trimmedVideo.editedVideo,
				});
				highlightFilenames.push(trimmedVideo.editedVideo.filename);
				response.sources.push(
					extendDownloadedVideoData(trimmedVideo.editedVideo)
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
				const downloadedHighlight = await downloadRange(
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
					extendDownloadedVideoData(downloadedHighlight)
				);
				count++;
			}

			totalHighlights += source.highlights.length;
        }
		
        if (!(source.highlights && source.highlights.length > 0) && !source.autoHighlights) {
			const video = await downloadRange(source.url, {
				resolution: source.resolution,
			});
			highlightFilenames.push(video.filename);
			response.sources.push(extendDownloadedVideoData(video));
		}
		console.log(
			`[Twilight] ${totalHighlights} highlights successfully downloaded!`
		);
	}

	if (payload.concat || payload.youtube) {
		console.log(
			`[Twilight] Concatenating ${highlightFilenames.length} highlights into one video ...`
		);
		const concatVideo = await videoConcat(highlightFilenames, undefined);
		console.log(
			`[Twilight] Successfully create video (${concatVideo.filename})`
		);
		response.concatVideo = concatVideo;

		if (payload.youtube) {
			console.log(`[Twilight] Upload video to YouTube ...`);
			const youtubeUploadResponse = await youtubeUpload(
				`${process.env.VIDEO_STORAGE_PATH}/${concatVideo.filename}`,
				payload.youtube
			);
			response.youtubeVideoId = youtubeUploadResponse.videoId;
		}
	}

	return response;
}
