import { FastifyReply, FastifyRequest } from "fastify";
import { downloadAndUploadVideoAPI } from "../apis/DownloadAndUploadVideo.api";

export type DownloadVideoController = FastifyRequest<{
    Body: {
        url: string
    }
}>

export async function downloadVideoController(request: DownloadVideoController, reply: FastifyReply) {
    const { url } = request.body
    const video = await downloadAndUploadVideoAPI({
        sources: [ { url } ]
    })
    return reply.send(video)
}