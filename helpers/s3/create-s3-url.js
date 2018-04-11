import {s3Config} from './s3'

export const createS3Url = (videoName) => `${s3Config().AWS_URL}/${s3Config().BUCKET_NAME}/${encodeURIComponent(videoName)}`
