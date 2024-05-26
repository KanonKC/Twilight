import fastify from "fastify"
import { downloadManyVideos } from "./controllers/DownloadManyVideos"

const server = fastify()

server.post('/downloads', downloadManyVideos)

export default server