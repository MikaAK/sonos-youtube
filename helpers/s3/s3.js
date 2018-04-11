import AWS from 'aws-sdk'

export const s3Config = () => {
  const {
    AWS_REGION, AWS_SECRET_ACCESS_KEY,
    AWS_ACCESS_KEY_ID, BUCKET_NAME
  } = process.env

  return {
    AWS_URL: `https://s3-${AWS_REGION}.amazonaws.com`,
    AWS_REGION, AWS_SECRET_ACCESS_KEY,
    AWS_ACCESS_KEY_ID, BUCKET_NAME
  }
}

export const updateAwsConfig = () => {
  const config = s3Config()

  AWS.config.update({
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY
  })
}


export const s3 = new AWS.S3()
