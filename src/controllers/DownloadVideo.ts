import { FastifyReply, FastifyRequest } from "fastify";
import { downloadVideoAPI } from "../apis/DownloadVideo.api";

export type DownloadVideoController = FastifyRequest<{
    Body: {
        url: string
    }
}>

export async function downloadVideoController(request: DownloadVideoController, reply: FastifyReply) {
    const { url } = request.body
    const video = await downloadVideoAPI(url)
    return reply.send(video)
}