import {unlink} from 'fs'
import {bindNodeCallback} from 'rxjs/observable/bindNodeCallback'

export const deleteFile$ = bindNodeCallback(unlink)
