import {fromPromise} from 'rxjs/observable/fromPromise'
import {map as rxMap, mergeMap} from 'rxjs/operators'
import {compose, replace, prop, __} from 'ramda'

import {sonosDevices$} from './sonos-devices'
import {getMasterDevice$} from './get-master-device'
import {playMedia$} from './play-media'

const macAddress = compose(replace(/:/g, ''), prop('MACAddress'))
const macUri = (macAddress) => `x-sonos-htastream:RINCON_${macAddress}01400:spdif`
const zoneMacUri = compose(macUri, macAddress)

const playDeviceLineIn$ = (device) => fromPromise(device.getZoneInfo())
  .pipe(
    rxMap(zoneMacUri),
    mergeMap(playMedia$(__, device))
  )

export const switchToLineIn$ = (roomName) => sonosDevices$
  .pipe(
    mergeMap(getMasterDevice$(roomName)),
    mergeMap(playDeviceLineIn$)
  )
