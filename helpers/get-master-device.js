import {fromPromise} from 'rxjs/observable/fromPromise'
import {map as rxMap} from 'rxjs/operators'

import {
  prop,
  curry, propEq, pipeP,
  head, map, complement,
  match, compose, composeP,
  filter, isEmpty, find, nth
} from 'ramda'

import {callProp} from './call-prop'

const isNotEmpty = complement(isEmpty)
const nameEq = propEq('name')
const constructSonos = (ip) => new Sonos(ip)

const hasMultipleDevicesForName = (roomName, devices) => compose(
  isNotEmpty,
  filter(nameEq(roomName))
)(devices)

const parseIpFromLocation = compose(
  nth(1),
  match(/:\/\/(.*):/)
)
const getZoneIp = compose(parseIpFromLocation, prop('location'))

const getCordinator = find(propEq('coordinator', 'true'))
const getDeviceZones = composeP(prop('zones'), callProp('getTopology'))
const getMasterIp = pipeP(
  compose(getDeviceZones, head),
  getCordinator,
  getZoneIp
)

const findDeviceByName = (roomName, devices) => {
  const device = devices.find(nameEq(roomName))

  if (device)
    return Promise.resolve(device)
  else
    return Promise.reject(device)
}

const findDeviceByIp = curry((devices, ip) => devices.find(propEq('host', ip)))

const getDeviceTopologies = map(callProp('getTopology'))

export const getMasterDevice$ = curry((roomName, devices) => {
  if (hasMultipleDevicesForName(roomName, devices)) {
    console.debug('Multiple devices found. Finding group cordinator...')

    return fromPromise(getMasterIp(devices))
    .pipe(
      rxMap(findDeviceByIp(devices))
    )
  } else {
    console.debug('Found Device...')

    return fromPromise(findDeviceByName(roomName, devices))
  }
})
