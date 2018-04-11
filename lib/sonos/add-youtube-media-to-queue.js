import {mergeMap} from 'rxjs/operators'
import {curry} from 'ramda'

import {findOrDownloadYoutubeMp3$} from '../youtube'
import {log$} from '../util'

import {playSongInRoom$} from './play-song-in-room'
import {deviceList$} from './device-list'
import {addToQueue$} from './add-to-queue'

const addToMasterDeviceQueue$ = curry((speakerName, url) => deviceList$
  .pipe(
    mergeMap(addToQueue$(speakerName, url))
  ))

export const addYoutubeMediaToSonosQueue$ = curry((speakerName, youtubeIdOrUrl) => findOrDownloadYoutubeMp3$(youtubeIdOrUrl)
  .pipe(
    log$('Adding MP3 to queue...'),
    mergeMap(addToMasterDeviceQueue$(speakerName))
  ))
