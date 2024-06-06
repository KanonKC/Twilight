import fastify from "fastify"
import { downloadManyHighlights } from "./controllers/DownloadManyHighlights"
import { uploadVideoToYoutube } from "./controllers/UploadVideoToYoutube"

const server = fastify()

server.post('/highlights', downloadManyHighlights)
server.post('/youtube', uploadVideoToYoutube)

export default server