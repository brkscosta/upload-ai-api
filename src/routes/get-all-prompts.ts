import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'

export async function getAllPromptsRoute(app: FastifyInstance) {
  app.get('/api/v1/prompts', async () => {
    const prompts = await prisma.prompt.findMany()

    return prompts
  })
}
