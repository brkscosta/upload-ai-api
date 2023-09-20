import S3 from 'aws-sdk/clients/s3'

export const s3 = new S3({
  credentials: {
    accessKeyId: process.env.AMAZON_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AMAZON_SECRET_ACCESS_KEY,
  },
  region: process.env.AMAZON_S3_REGION,
  httpOptions: {
    timeout: parseInt(process.env.AMAZON_S3_TIMEOUT),
    connectTimeout: parseInt(process.env.AMAZON_S3_CONNECT_TIMEOUT),
  },
  maxRetries: 3,
})
