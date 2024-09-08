import fastify from "fastify"
import { downloadVideoController } from "./controllers/DownloadVideo.controller"
import { uploadVideoToYoutubeController } from "./controllers/UploadVideoToYoutube.controller"

const server = fastify()

// server.post('/highlights', downloadManyHighlights)
server.post('/youtube', uploadVideoToYoutubeController)
server.post('/download', downloadVideoController)

export default server