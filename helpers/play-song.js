import {propEq, curry, always, prop} from 'ramda'
import {fromPromise} from 'rxjs/observable/fromPromise'
import {mapTo as rxMapTo} from 'rxjs/operators'

export const playSong = curry((roomName, url, devices) => {
  const device = devices.find(propEq('name', roomName))

  if (device)
    return fromPromise(device.setAVTransportURI(url))
      .pipe(rxMapTo(devices))
  else
    throw new Error(`No device with name: ${roomName}\nDevices: ${devices.map(prop('name'))}`)
})
