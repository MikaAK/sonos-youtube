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

export const setS3Config = (config) => {
  S3_CONFIG = config

  AWS.config.update({
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY
  })
}

export const s3 = new AWS.S3()
