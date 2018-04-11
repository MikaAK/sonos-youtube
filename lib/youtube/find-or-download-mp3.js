import {curry, compose, nth, match, when} from 'ramda'
import {mergeMap, mapTo as rxMapTo} from 'rxjs/operators'
import {of as rxOf} from 'rxjs/observable/of'

import {log$} from '../util'
import {deleteFile$} from '../file'
import {uploadVideo$, searchFile$, createS3Url} from '../s3'

import {isYoutubeUrl} from './is-youtube-url'
import {downloadYoutubeMp3$} from './download-mp3'

const youtubeUrlId = compose(nth(1), match(/\/watch\?v=(.*)/))
const getYoutubeId = when(isYoutubeUrl, youtubeUrlId)

const downloadAndUploadYoutubeMp3$ = (youtubeIdOrUrl) => downloadYoutubeMp3$(youtubeIdOrUrl)
  .pipe(
    log$('Downloaded MP3...\nUploading to server...'),
    mergeMap(uploadVideoAndDeleteFile$),
    log$('Uploaded MP3...')
  )

const createS3Url$ = (s3FileName) => rxOf(createS3Url(s3FileName))

const uploadVideoAndDeleteFile$ = (fileName) => uploadVideo$(fileName)
  .pipe(
    mergeMap((videoUrl) => deleteFile$(fileName).pipe(rxMapTo(videoUrl)))
  )

const getUrlOrDownloadFile$ = curry((youtubeIdOrUrl, s3File) => {
  if (s3File) {
    console.debug('S3 file found...')

    return createS3Url$(s3File)
  } else {
    console.debug('No S3 file found, downloading MP3...')

    return downloadAndUploadYoutubeMp3$(youtubeIdOrUrl)
  }
})

export const findOrDownloadYoutubeMp3$ = (youtubeIdOrUrl) => {
  console.debug('Searching MP3...')

  return searchFile$(getYoutubeId(youtubeIdOrUrl))
    .pipe(
      mergeMap(getUrlOrDownloadFile$(youtubeIdOrUrl))
    )
}
