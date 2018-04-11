import {mergeMap} from 'rxjs/operators'
import {curry} from 'ramda'

import {findOrDownloadYoutubeMp3$} from '../youtube'
import {log$} from '../util'

import {playSongInRoom$} from './play-song-in-room'
import {deviceList$} from './device-list'

const playSonosSong$ = curry((speakerName, url) => deviceList$
  .pipe(
    mergeMap(playSongInRoom$(speakerName, url))
  ))

export const playYoutubeMediaOnSonosSpeaker$ = curry((speakerName, youtubeIdOrUrl) => findOrDownloadYoutubeMp3$(youtubeIdOrUrl)
  .pipe(
    log$('Playing MP3...'),
    mergeMap(playSonosSong$(speakerName))
  ))
