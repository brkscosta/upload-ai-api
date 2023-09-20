export {}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string
      NODE_ENV: 'dev' | 'prod'
      OPENAI_KEY: string
      OPENAI_ORGANIZATION: string
      AMAZON_S3_ACCESS_KEY_ID: string
      AMAZON_SECRET_ACCESS_KEY: string
      AMAZON_S3_BUCKET_NAME: string
      AMAZON_S3_REGION: string
      AMAZON_S3_TIMEOUT: string
      AMAZON_S3_CONNECT_TIMEOUT: string
      NODE_PORT: string
      FRONT_END_HOSTNAME: string
    }
  }
}
