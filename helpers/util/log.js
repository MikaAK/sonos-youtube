import {tap as rxTap} from 'rxjs/operators'

export const log$ = (msg) => rxTap((...args) => console.debug(msg, ...args))
