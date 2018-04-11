import path from 'path'
import {readFile} from 'fs'
import {Observable} from 'rxjs/Observable'
import {mergeMap, map as rxMap, mapTo as rxMapTo} from 'rxjs/operators'
import {bindNodeCallback} from 'rxjs/observable/bindNodeCallback'
import {curry} from 'ramda'

import {createS3Client, s3Config} from './s3'
import {createS3Url} from './create-s3-url'

const readFile$ = bindNodeCallback(readFile)

const putS3Object$ = (config) => {
  const s3 = createS3Client()

  return bindNodeCallback(s3.putObject.bind(s3))(config)
}

const uploadBinary$ = curry((videoName, binary) => putS3Object$({
  Bucket: s3Config().BUCKET_NAME,
  Key: videoName,
  Body: binary,
  ACL: 'public-read'
}))

const readFileAsBinary$ = (videoPath) => readFile$(videoPath)
  .pipe(rxMap((data) => new Buffer(data, 'binary')))

export const uploadVideo$ = (videoName) => readFileAsBinary$(videoName)
  .pipe(
    mergeMap(uploadBinary$(videoName)),
    rxMapTo(createS3Url(videoName))
  )
