import {curry, always} from 'ramda'
import {mergeMap} from 'rxjs/operators'

import {getMasterDevice$} from './get-master-device'
import {playSong$} from './play-song'

export const playSongInRoom$ = curry((roomName, url, devices) => getMasterDevice$(roomName, devices)
  .pipe(
    mergeMap(playSong$(url))
  ))
