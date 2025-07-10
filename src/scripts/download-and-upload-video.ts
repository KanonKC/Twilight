import { ConcatenatedVideo, DownloadedVideo } from "@prisma/client";
import config from "../configs";
import FFmpeg from "../externals/ffmpeg/ffmpeg";
import Python from "../externals/python/python";
import TwitchDl from "../externals/twitch-dl/twitch-dl";
import YtDlp from "../externals/yt-dlp/yt-dlp";
import ConcatenatedService from "../services/concatenated/concatenated.service";
import DownloadService from "../services/download/download.service";
import UploadService from "../services/upload/upload.service";
import { videoTrim } from "../services/videos/video-trim";
import { YoutubeUploadVideoDetail } from "../types/Youtube.type";
import { convertSecondsToHHMMSSString } from "../utilities/Time";

const payload: DownloadAndUploadVideoRequest = {
	sources: [
		{
            url: "https://www.youtube.com/live/vX2t5c8LVUA",
            // autoHighlights: true,
            highlights: [
                {
                    start: "01:21:20",
                    end: "01:21:30",
                }, 
                // {
                //     start: "00:18:03",
                //     end: "00:18:15",
                // }, 
                // {
                //     start: "02:46:02",
                //     end: "02:46:08",
                // }, 
                // {
                //     start: "02:46:02",
                //     end: "02:46:08",
                // }, 
            ],
        },
	],
	// concat: true,
	// youtube: {
	//     title: "Visage Moment",
	//     description: "Very new upload",
	//     privacyStatus: "private",
	// }
};

downloadAndUploadVideo(payload).then(console.log);

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

interface DownloadAndUploadVideoRequest {
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

async function downloadAndUploadVideo(
	payload: DownloadAndUploadVideoRequest
): Promise<DownloadAndUploadVideoResponse> {
	const twitchDl = new TwitchDl();
	const ffmpeg = new FFmpeg(config);
	const ytDlp = new YtDlp();
	const python = new Python();
	const ds = new DownloadService(twitchDl, ffmpeg, ytDlp, config);
	const cs = new ConcatenatedService(config);
	const us = new UploadService(python);
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
			video = await ds.downloadRange(source.url, {
				resolution: source.resolution,
			});
			console.log(
				`[Twilight] Download video success! (${video.filename})`
			);

			console.log(`[Twilight] Detecting audio spikes ...`);
			const audioSpike = await python.getAudioSpike(
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
					ds.extendDownloadedVideoData(trimmedVideo.editedVideo)
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
				const downloadedHighlight = await ds.downloadRange(source.url, {
					range: {
						start: highlight.start,
						end: highlight.end,
					},
					resolution: source.resolution,
				});
				sourceResponse.highlights.push({
					start: highlight.start,
					end: highlight.end,
					downloadVideo: downloadedHighlight,
				});
				highlightFilenames.push(downloadedHighlight.filename);
				response.sources.push(
					ds.extendDownloadedVideoData(downloadedHighlight)
				);
				count++;
			}

			totalHighlights += source.highlights.length;
		}

		if (
			!(source.highlights && source.highlights.length > 0) &&
			!source.autoHighlights
		) {
			const video = await ds.downloadRange(source.url, {
				resolution: source.resolution,
			});
			highlightFilenames.push(video.filename);
			response.sources.push(ds.extendDownloadedVideoData(video));
		}
		console.log(
			`[Twilight] ${totalHighlights} highlights successfully downloaded!`
		);
	}

	if (payload.concat || payload.youtube) {
		console.log(
			`[Twilight] Concatenating ${highlightFilenames.length} highlights into one video ...`
		);
		const concatVideo = await cs.concatVideos(
			highlightFilenames,
			undefined
		);
		console.log(
			`[Twilight] Successfully create video (${concatVideo.filename})`
		);
		response.concatVideo = concatVideo;

		if (payload.youtube) {
			console.log(`[Twilight] Upload video to YouTube ...`);
			const youtubeUploadResponse = await us.uploadYoutubeVideo(
				`${process.env.VIDEO_STORAGE_PATH}/${concatVideo.filename}`,
				payload.youtube
			);
			response.youtubeVideoId = youtubeUploadResponse.videoId;
		}
	}

	return response;
}
