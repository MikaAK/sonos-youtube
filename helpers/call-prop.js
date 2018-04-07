import {curry} from 'ramda'

export const callProp = curry((prop, obj) => obj[prop]())
