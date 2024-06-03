import fastify from "fastify"
import { downloadManyHighlights } from "./controllers/DownloadManyHighlights"

const server = fastify()

server.post('/highlights', downloadManyHighlights)

export default server