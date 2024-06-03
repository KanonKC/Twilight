import { FastifyReply, FastifyRequest } from "fastify";
import { DownloadManyHighlightRequest, downloadManyHighlightsAPI } from "../apis/DownloadManyHighlight.api";


export async function downloadManyHighlights(request: FastifyRequest, reply: FastifyReply) {
    const result = await downloadManyHighlightsAPI(request.body as DownloadManyHighlightRequest)
    return result
}