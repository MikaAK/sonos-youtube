import {mergeMap, mapTo as rxMapTo} from 'rxjs/operators'
import {prop} from 'ramda'

import {playSong} from './helpers/play-song'
import {sonosDevices$} from './helpers/sonos-devices'
import {downloadYoutubeMp3$} from './helpers/download-youtube-mp3'
import {uploadVideoToS3$} from './helpers/upload-video-to-s3'
import {deleteFile$} from './helpers/delete-file'

const playSongInBathroom = playSong('Bathroom')

const uploadVideoAndDeleteFile$ = (fileName) => uploadVideoToS3$(fileName)
  .pipe(
    mergeMap((videoUrl) => deleteFile$(fileName).pipe(rxMapTo(videoUrl)))
  )

const playSonosSong$ = (url) => sonosDevices$
  .pipe(
    mergeMap(playSongInBathroom(url))
  )

downloadYoutubeMp3$('xQyZYPZT0tI')
  .pipe(mergeMap(uploadVideoAndDeleteFile$), mergeMap(playSonosSong$))
  .subscribe(() => console.log('Played Media Successfuly'))
    // .subscribe((devices) => {
    //   console.log('success', devices.map(prop('name')))

    //   process.exit(1)
    // })

