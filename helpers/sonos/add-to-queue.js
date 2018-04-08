import {curry, always} from 'ramda'
import {mergeMap} from 'rxjs/operators'

import {getMasterDevice$} from './get-master-device'

const addToDeviceQueue$ = curry((url, device) => device.queue(url))

export const addToQueue$ = curry((roomName, url, devices) => getMasterDevice$(roomName, devices)
  .pipe(
    mergeMap(addToDeviceQueue$(url))
  ))
