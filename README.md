# Upload AI API

This is the README file for the Upload AI API project. This project utilizes PNPM as the package manager and MongoDB as the database with Prisma as the database ORM.

## Setup

To set up the Upload AI API project, follow these steps:

## Prerequisites

1. Make sure you have Node.js installed on your system.
2. Install PNPM globally if you haven't already:
    ```bash
    npm install -g pnpm
    ```
3. Make sure you have a MongoDB server running or set up a MongoDB instance.

## Clone the Repository

```bash
git clone <repository_url>
cd upload-ai-api
```

## Install Dependencies

```bash
pnpm install
```
## Environment Variables

Create a .env file in the root of the project and configure your environment variables. You can use the provided dotenv package for managing environment variables.

```env
MONGODB_URI= "your_mongodb_uri"
OPENAI_KEY= "your_openai_api_key"
```

## Database Setup

To set up the database using Prisma, run the following commands. The command `pnpm prisma db push` only will work if you aready have a valid connection string with the remote database or docker container.

```bash
pnpm prisma generate
pnpm prisma db push
```
You can check the reference for mongodb setup here: [Install Prisma Client](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/mongodb/install-prisma-client-typescript-mongodb").

## Start the Development Server

```bash
pnpm dev
```
This will start the server and you can access the API at http://localhost:YOUR_PORT.

## Scripts
- pnpm dev: Starts the development server using TSX to watch for changes in the src/server.ts file.
- pnpm prisma generate: Generates Prisma client code based on your database schema.
- pnpm prisma db push: Will push your database to remote host (e.g: MonngoAtlas)
- pnpm prisma seed: Seeds the database with initial data.
- pnpm run lint: Format code and identify potential problems.

## Dependencies
- @fastify/cors: Fastify CORS plugin for enabling Cross-Origin Resource Sharing.
- @fastify/multipart: Fastify multipart plugin for handling file uploads.
- @prisma/client: Prisma client for database interaction.
- ai: AI library (version 2.2.12).
- dotenv: Library for loading environment variables.
- fastify: Fastify web framework.
- mongodb: MongoDB driver for Node.js.
- openai: OpenAI library for AI capabilities.
- zod: Zod for runtime checking of types.

## License
This project is licensed under the ISC License. See the LICENSE file for details.

---

Feel free to customize this README further to include additional project-specific information or instructions.