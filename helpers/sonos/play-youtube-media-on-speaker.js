import {of as rxOf} from 'rxjs/observable/of'
import {mergeMap} from 'rxjs/operators'
import {curry} from 'ramda'

import {findOrDownloadYoutubeMp3$} from '../youtube'
import {log$} from '../util'

import {playSong$} from './play-song'
import {deviceList$} from './device-list'

const playSonosSong$ = curry((speakerName, url) => deviceList$
  .pipe(
    mergeMap(playSong$(speakerName, url))
  ))

export const playYoutubeMediaOnSonosSpeaker$ = curry((speakerName, youtubeIdOrUrl) => findOrDownloadYoutubeMp3$(youtubeIdOrUrl)
  .pipe(
    log$('Playing MP3...'),
    mergeMap(playSonosSong$(speakerName))
  ))
