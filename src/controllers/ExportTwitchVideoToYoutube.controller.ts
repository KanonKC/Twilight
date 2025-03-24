import { FastifyReply, FastifyRequest } from "fastify";
import { YoutubeUploadVideoDetail } from "../types/Youtube.type";
import { downloadAndUploadVideoAPI, DownloadAndUploadVideoRequest } from "../apis/DownloadAndUploadVideo.api";

export type ExportTwitchVideoToYoutubeController = FastifyRequest<{
	Body: {
		url: string;
		resolution?: { width: number; height: number };
		highlights?: {
			start: string;
			end: string;
		}[];
		youtube: YoutubeUploadVideoDetail | null | undefined;
	};
}>;

export async function exportTwitchVideoToYoutube(
	request: ExportTwitchVideoToYoutubeController,
	reply: FastifyReply
) {
	const { body } = request;

	const payload: DownloadAndUploadVideoRequest = {
        sources: [
            {
                url: body.url,
                resolution: body.resolution,
                highlights: body.highlights
            }
        ],
        concat: true,
        youtube: body.youtube
    };

	const video = await downloadAndUploadVideoAPI(payload);
	return reply.send(video);
}
