import { FastifyInstance } from 'fastify'
import { File } from 'node:buffer'
import z from 'zod'
import { s3 } from '../lib/aws'
import { openai } from '../lib/openai'
import { prisma } from './../lib/prisma'

async function getAudioOrThrow(path: string) {
  const fileName = path.split('.com/')[1]

  const response = await s3
    .getObject({
      Bucket: process.env.AMAZON_S3_BUCKET_NAME,
      Key: fileName,
    })
    .promise()

  return response.Body as Buffer
}

export async function createTranscriptionRoute(app: FastifyInstance) {
  app.post('/api/v1/videos/:videoId/transcription', async (request) => {
    const paramsSchema = z.object({
      videoId: z.string(),
    })

    const { videoId } = paramsSchema.parse(request.params)

    const bodySchema = z.object({
      prompt: z.string(),
    })

    const { prompt } = bodySchema.parse(request.body)

    const video = await prisma.video.findUniqueOrThrow({
      where: {
        id: videoId,
      },
    })

    const buffer = await getAudioOrThrow(video.path)
    const audioFile = new File([buffer], 'audio.mp3', {
      type: 'audio/mpeg',
    })

    const response = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'pt',
      response_format: 'json',
      temperature: 0,
      prompt,
    })

    const transcription = response.text

    await prisma.video.update({
      where: {
        id: videoId,
      },
      data: {
        transcription,
      },
    })

    return { transcription }
  })
}
