import { FastifyReply, FastifyRequest } from "fastify";
import { UploadVideoToYoutubeRequest, uploadVideoToYoutubeAPI } from "../apis/UploadVideoToYoutube.api";

export async function uploadVideoToYoutubeController(request: FastifyRequest, reply: FastifyReply) {
    return uploadVideoToYoutubeAPI(request.body as UploadVideoToYoutubeRequest)
}