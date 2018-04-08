import {fromPromise} from 'rxjs/observable/fromPromise'
import {mergeMap} from 'rxjs/operators'

import {
  prop, join,
  curry, propEq, pipeP,
  head, map, complement,
  match, compose, composeP,
  filter, isEmpty, find, nth
} from 'ramda'

import {callProp} from '../util/call-prop'

const isNotEmpty = complement(isEmpty)
const nameEq = propEq('name')
const filterRoomName = (roomName) => filter(nameEq(roomName))

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

const getMasterIp = (roomName) => pipeP(
  compose(getDeviceZones, head),
  filterRoomName(roomName),
  getCordinator,
  getZoneIp
)

const getMasterRoomIp$ = (roomName, devices) => {
  return compose(
    fromPromise,
    getMasterIp(roomName),
    filterRoomName(roomName)
  )(devices)
}

const deviceIpList = compose(join(', '), map(prop('host')))
const createError = (type, typeInstance, devices) => ({message: `Cannot find device by ${type}: ${typeInstance}\nDevices: ${deviceIpList(devices)}`})

const findDeviceByName = (roomName, devices) => {
  const device = devices.find(nameEq(roomName))

  if (device)
    return Promise.resolve(device)
  else
    return Promise.reject(createError('name', roomName, devices))
}

const findDeviceByIp = curry((devices, ip) => {
  const device = devices.find(propEq('host', ip))

  if (device)
    return Promise.resolve(device)
  else
    return Promise.reject(createError('IP', ip, devices))
})

const getDeviceTopologies = map(callProp('getTopology'))

export const getMasterDevice$ = curry((roomName, devices) => {
  if (hasMultipleDevicesForName(roomName, devices)) {
    console.debug('Multiple devices found. Finding group cordinator...')

    return getMasterRoomIp$(roomName, devices)
      .pipe(
        mergeMap(findDeviceByIp(devices))
      )
  } else {
    console.debug('Found Device...')

    return fromPromise(findDeviceByName(roomName, devices))
  }
})
