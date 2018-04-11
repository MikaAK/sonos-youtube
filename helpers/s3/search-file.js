import {Observable} from 'rxjs/Observable'
import {curry, prop} from 'ramda'

import {s3, s3Config} from './s3'

const fileKey = curry((key, item) => {
  const regex = new RegExp(key)

  return regex.test(item)
})

export const searchFile$ = (key) => new Observable((observer) => {
  const Bucket = s3Config().BUCKET_NAME

  s3.listObjectsV2({Bucket}, (err, data) => {
    if (err)
      return observer.error(err)

    const {Contents: items} = data

    const item = items
      .map(prop('Key'))
      .find(fileKey(key))

    observer.next(item)
    observer.complete()
  })
})

