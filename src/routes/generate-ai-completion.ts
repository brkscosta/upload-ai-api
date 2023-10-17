import { OpenAIStream, streamToResponse } from 'ai'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { openai } from '../lib/openai'
import { prisma } from '../lib/prisma'

export async function generateAICompletionRoute(app: FastifyInstance) {
  app.post('/api/v1/ai/complete', async (req, reply) => {
    const bodySchema = z.object({
      videoId: z.string(),
      prompt: z.string(),
      temperature: z.number().min(0).max(1).default(0.5),
    })

    const { videoId, prompt, temperature } = bodySchema.parse(req.body)

    const video = await prisma.video.findUniqueOrThrow({
      where: {
        id: videoId,
      },
    })

    if (!video.transcription) {
      return reply
        .status(400)
        .send({ error: 'video transcription was not generated yet' })
    }

    const promptMessage = prompt.replace('{transcription}', video.transcription)

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-16k',
      temperature,
      messages: [{ role: 'user', content: promptMessage }],
      stream: true,
    })

    const stream = OpenAIStream(response)

    if (!req.headers.origin) {
      return reply.status(400).send({ error: 'origin client is empty' })
    }

    const hostName = new URL(req.headers.origin).hostname

    if (hostName !== process.env.FRONT_END_HOSTNAME) {
      return reply.status(400).send({ error: 'origin client not allowed' })
    }

    streamToResponse(stream, reply.raw, {
      headers: {
        'Access-Control-Allow-Origin': req.headers.origin,
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
      },
    })
  })
}
