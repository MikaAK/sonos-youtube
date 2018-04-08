import {BUCKET_NAME, AWS_URL} from './s3'

export const createS3Url = (videoName) => `${AWS_URL}/${BUCKET_NAME}/${encodeURIComponent(videoName)}`
