import {mergeMap, mapTo as rxMapTo, tap as rxTap} from 'rxjs/operators'
import {curry} from 'ramda'

import {playSong$} from './play-song'
import {sonosDevices$} from './sonos-devices'
import {downloadYoutubeMp3$} from './download-youtube-mp3'
import {uploadVideoToS3$} from './upload-video-to-s3'
import {deleteFile$} from './delete-file'

const uploadVideoAndDeleteFile$ = (fileName) => uploadVideoToS3$(fileName)
  .pipe(
    mergeMap((videoUrl) => deleteFile$(fileName).pipe(rxMapTo(videoUrl)))
  )

const playSonosSong$ = curry((speakerName, url) => sonosDevices$
  .pipe(
    mergeMap(playSong$(speakerName, url))
  ))

export const log$ = (msg) => rxTap((...args) => console.log(msg, ...args))

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
