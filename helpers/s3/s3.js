import AWS from 'aws-sdk'

export const {
  AWS_REGION, AWS_SECRET_ACCESS_KEY,
  AWS_ACCESS_KEY_ID, BUCKET_NAME
} = process.env

export const AWS_URL = `https://s3-${AWS_REGION}.amazonaws.com`

AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY
})

export const s3 = new AWS.S3()
