import {DeviceDiscovery} from 'sonos'
import {curry, prop, flip, prepend, assoc} from 'ramda'
import {Observable} from 'rxjs/Observable'
import {forkJoin} from 'rxjs/observable/forkJoin'

import {
  mergeMap,
  debounceTime,
  map as rxMap,
  scan as rxScan
} from 'rxjs/operators'

import {callProp} from '../util/call-prop'

const setName = assoc('name')

const discoverSonosDevices$ = new Observable((observer) => {
  const callback = (device) => {
    observer.next(device)
  }

  DeviceDiscovery(callback)

  return callback
})

const mapNamesToDevices = (names, devices) => devices.map((device, i) => setName(names[i], device))

const organizeDevices$ = (devices) => forkJoin(devices.map(callProp('getName')))
  .pipe(rxMap((names) => mapNamesToDevices(names, devices)))

export const deviceList$ = discoverSonosDevices$
  .pipe(
    rxScan(flip(prepend), []),
    debounceTime(500),
    mergeMap(organizeDevices$),
  )
