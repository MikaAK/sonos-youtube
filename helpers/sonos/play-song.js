import {curry, always} from 'ramda'
import {mergeMap} from 'rxjs/operators'

import {getMasterDevice$} from './get-master-device'
import {playMedia$} from './play-media'

export const playSong$ = curry((roomName, url, devices) => getMasterDevice$(roomName, devices)
  .pipe(
    mergeMap(playMedia$(url))
  ))
