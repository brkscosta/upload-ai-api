import { fastifyCors } from '@fastify/cors'
import 'dotenv/config'
import { fastify } from 'fastify'
import {
  createTranscriptionRoute,
  generateAICompletionRoute,
  getAllPromptsRoute,
  uploadVideoRoute,
} from './routes'

const app = fastify()

app.register(fastifyCors, {
  origin: (origin, cb) => {
    if (!origin) {
      cb(null, false)
      return
    }

    const hostname = new URL(origin).hostname
    console.log(origin)

    if (hostname !== process.env.FRONT_END_HOSTNAME) {
      cb(new Error('Not allowed'), false)
      return
    }

    cb(null, true)
  },
})

app.get('/healthz', (_response, reply) => {
  return reply.status(200).send()
})

app.register(getAllPromptsRoute)
app.register(uploadVideoRoute)
app.register(createTranscriptionRoute)
app.register(generateAICompletionRoute)

app
  .listen({ host: '0.0.0.0', port: parseInt(process.env.NODE_PORT) | 3333 })
  .then((address: string) => {
    console.log(`🚀 HTTP server is running... ${address}`)
  })
