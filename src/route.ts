import fastify from "fastify"
import { downloadManyHighlights } from "./controllers/DownloadManyHighlights"
import { uploadVideoToYoutube } from "./controllers/UploadVideoToYoutube"
import { downloadVideoController } from "./controllers/DownloadVideo"

const server = fastify()

server.post('/highlights', downloadManyHighlights)
server.post('/youtube', uploadVideoToYoutube)
server.post('/download', downloadVideoController)

export default server