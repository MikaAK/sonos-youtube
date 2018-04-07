import path from 'path'
import {readFile} from 'fs'
import AWS from 'aws-sdk'
import {Observable} from 'rxjs/Observable'
import {mergeMap, map as rxMap, mapTo as rxMapTo} from 'rxjs/operators'
import {bindNodeCallback} from 'rxjs/observable/bindNodeCallback'
import {curry} from 'ramda'

const {
  AWS_REGION, AWS_SECRET_ACCESS_KEY,
  AWS_ACCESS_KEY_ID, BUCKET_NAME
} = process.env

const AWS_URL = `https://s3-${AWS_REGION}.amazonaws.com`
const readFile$ = bindNodeCallback(readFile)

AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY
})

const s3 = new AWS.S3()

const putS3Object$ = bindNodeCallback(s3.putObject.bind(s3))

const uploadBinaryToS3$ = curry((videoName, binary) => putS3Object$({
  Bucket: BUCKET_NAME,
  Key: videoName,
  Body: binary,
  ACL: 'public-read'
}))

const readFileAsBinary$ = (videoPath) => readFile$(videoPath)
  .pipe(rxMap((data) => new Buffer(data, 'binary')))

export const uploadVideoToS3$ = (videoName) => readFileAsBinary$(videoName)
  .pipe(
    mergeMap(uploadBinaryToS3$(videoName)),
    rxMapTo(`${AWS_URL}/${BUCKET_NAME}/${encodeURIComponent(videoName)}`)
  )
