import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'

export async function getAllPromptsRoute(app: FastifyInstance) {
  app.addHook('onRequest', (request) => request.jwtVerify())

  app.get('/api/v1/prompts', async () => {
    const prompts = await prisma.prompt.findMany()

    return prompts
  })
}
