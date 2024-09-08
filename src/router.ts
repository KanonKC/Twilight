import fastify from "fastify"
import { downloadVideoController } from "./controllers/DownloadVideo.controller"

const server = fastify()

server.post('/download', downloadVideoController)
// server.post('/highlights', downloadManyHighlights)
// server.post('/youtube', uploadVideoToYoutubeController)

export default server