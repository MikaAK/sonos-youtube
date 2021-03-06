import {fromPromise} from 'rxjs/observable/fromPromise'
import {map as rxMap, mergeMap} from 'rxjs/operators'
import {compose, replace, prop, __} from 'ramda'

import {deviceList$} from './device-list'
import {getMasterDevice$} from './get-master-device'
import {playSong$} from './play-song'

const macAddress = compose(replace(/:/g, ''), prop('MACAddress'))
const macUri = (macAddress) => `x-sonos-htastream:RINCON_${macAddress}01400:spdif`
const zoneMacUri = compose(macUri, macAddress)

const playDeviceLineIn$ = (device) => fromPromise(device.getZoneInfo())
  .pipe(
    rxMap(zoneMacUri),
    mergeMap(playSong$(__, device))
  )

export const switchToLineIn$ = (roomName) => deviceList$
  .pipe(
    mergeMap(getMasterDevice$(roomName)),
    mergeMap(playDeviceLineIn$)
  )
