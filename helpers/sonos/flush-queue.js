import {mergeMap} from 'rxjs/operators'

import {getMasterDevice$} from './get-master-device'
import {deviceList$} from './device-list'

export const flushQueue$ = (roomName) => deviceList$
  .pipe(
    mergeMap(getMasterDevice$(roomName)),
    mergeMap((device) => device.flush())
  )
