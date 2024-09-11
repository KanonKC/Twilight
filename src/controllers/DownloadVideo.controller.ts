import { FastifyReply, FastifyRequest } from "fastify";
import { downloadAndUploadVideoAPI, DownloadAndUploadVideoRequest } from "../apis/DownloadAndUploadVideo.api";

export type DownloadVideoController = FastifyRequest<{
    Body: DownloadAndUploadVideoRequest
}>

export async function downloadVideoController(request: DownloadVideoController, reply: FastifyReply) {
    const payload = request.body
    const video = await downloadAndUploadVideoAPI(payload)
    return reply.send(video)
}