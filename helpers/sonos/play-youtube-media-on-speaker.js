import {mergeMap, mapTo as rxMapTo, tap as rxTap} from 'rxjs/operators'
import {curry, compose, match, nth} from 'ramda'

import {downloadYoutubeMp3$} from '../youtube/download-mp3'
import {uploadVideo$} from '../s3/upload-video'
import {deleteFile$} from '../file/delete'
import {isYoutubeUrl} from '../youtube/is-youtube-url'

import {playSong$} from './play-song'
import {deviceList$} from './device-list'

const uploadVideoAndDeleteFile$ = (fileName) => uploadVideo$(fileName)
  .pipe(
    mergeMap((videoUrl) => deleteFile$(fileName).pipe(rxMapTo(videoUrl)))
  )

const playSonosSong$ = curry((speakerName, url) => deviceList$
  .pipe(
    mergeMap(playSong$(speakerName, url))
  ))

export const log$ = (msg) => rxTap((...args) => console.log(msg, ...args))

const youtubeUrlId = compose(nth(1), match(/\/watch\?v=(.*)/))
const getYoutubeId = (youtubeIdOrUrl) => isYoutubeUrl(youtubeIdOrUrl) ? youtubeUrlId(youtubeIdOrUrl) : youtubeIdOrUrl

export const playYoutubeMediaOnSonosSpeaker$ = curry((speakerName, youtubeIdOrUrl) => {
  console.log('Downloading MP3...')

  return downloadYoutubeMp3$(youtubeIdOrUrl)
    .pipe(
      log$('Downloaded MP3...\nUploading to server...'),
      mergeMap(uploadVideoAndDeleteFile$),
      log$('Uploaded MP3...\nStarting Media...'),
      mergeMap(playSonosSong$(speakerName))
    )
})
