import { fastifyMultipart } from '@fastify/multipart'
import { PutObjectRequest } from 'aws-sdk/clients/s3'
import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import path from 'node:path'
import { s3 } from '../lib/aws'
import { prisma } from '../lib/prisma'

const MAX_FILE_SIZE: number = 1_048_576 * 25 // 25mb

async function uploadFileToS3(
  fileStream: NodeJS.ReadableStream,
  s3FileName: string,
) {
  try {
    const expirationTime = new Date()
    expirationTime.setMinutes(expirationTime.getMinutes() + 2) // 2 minutes

    const params: PutObjectRequest = {
      Bucket: process.env.AMAZON_S3_BUCKET_NAME,
      Key: s3FileName,
      Body: fileStream,
      Expires: expirationTime,
      Tagging: 'TempFile=true',
    }

    const data = await s3.upload(params).promise()
    return data.Location
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw new Error('Error uploading file to S3: ' + err.message)
    }
  }
}

export async function uploadVideoRoute(app: FastifyInstance) {
  app.register(fastifyMultipart, {
    limits: {
      fileSize: MAX_FILE_SIZE,
    },
  })

  app.post('/api/v1/videos', async (request, reply) => {
    const data = await request.file()

    if (!data) {
      return reply.status(400).send({ error: 'Missing file input' })
    }

    const extention = path.extname(data.filename)

    if (extention !== '.mp3') {
      return reply
        .status(400)
        .send({ error: 'Invalid file type, please a MP3' })
    }

    const fileBaseName = path.basename(data.filename, extention)

    const fileUploadName = `${fileBaseName}-${randomUUID()}${extention}`

    const uploadDestiantion = await uploadFileToS3(data.file, fileUploadName)

    const video = await prisma.video.create({
      data: {
        title: data.filename,
        path: uploadDestiantion !== undefined ? uploadDestiantion : '',
      },
    })

    return video
  })
}
