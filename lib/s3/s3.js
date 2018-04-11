import AWS from 'aws-sdk'

let S3_CONFIG = {}

export const s3Config = () => {
  const {
    AWS_REGION, AWS_SECRET_ACCESS_KEY,
    AWS_ACCESS_KEY_ID, BUCKET_NAME,
    AWS_URL = `https://s3-${AWS_REGION}.amazonaws.com`,
  } = S3_CONFIG

  return {
    AWS_URL,
    AWS_REGION, AWS_SECRET_ACCESS_KEY,
    AWS_ACCESS_KEY_ID, BUCKET_NAME
  }
}

export const setS3Config = (config) => S3_CONFIG = config

export const createS3Client = (
  AWS_ACCESS_KEY_ID = S3_CONFIG.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY = S3_CONFIG.AWS_SECRET_ACCESS_KEY
) => {
  AWS.config.update({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY
  })

  return new AWS.S3()
}
