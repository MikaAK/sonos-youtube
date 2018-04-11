import {curry} from 'ramda'
import {fromPromise} from 'rxjs/observable/fromPromise'
import {mapTo as rxMapTo} from 'rxjs/operators'

export const playSong$ = curry((url, device) => fromPromise(device.setAVTransportURI(url))
  .pipe(rxMapTo(device)))
