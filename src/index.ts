import { configDotenv } from 'dotenv'
import server from './router'

configDotenv()
const PORT = Number(process.env.PORT) || 8081

server.listen({ port: PORT }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})