import path from 'path'
import {readFile} from 'fs'
import {Observable} from 'rxjs/Observable'
import {mergeMap, map as rxMap, mapTo as rxMapTo} from 'rxjs/operators'
import {bindNodeCallback} from 'rxjs/observable/bindNodeCallback'
import {curry} from 'ramda'

import {s3, BUCKET_NAME, AWS_URL} from './s3'

const readFile$ = bindNodeCallback(readFile)

const putS3Object$ = bindNodeCallback(s3.putObject.bind(s3))

const uploadBinary$ = curry((videoName, binary) => putS3Object$({
  Bucket: BUCKET_NAME,
  Key: videoName,
  Body: binary,
  ACL: 'public-read'
}))

const readFileAsBinary$ = (videoPath) => readFile$(videoPath)
  .pipe(rxMap((data) => new Buffer(data, 'binary')))

export const uploadVideo$ = (videoName) => readFileAsBinary$(videoName)
  .pipe(
    mergeMap(uploadBinary$(videoName)),
    rxMapTo(`${AWS_URL}/${BUCKET_NAME}/${encodeURIComponent(videoName)}`)
  )
