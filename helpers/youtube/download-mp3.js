import {exec} from 'child_process'
import {bindNodeCallback} from 'rxjs/observable/bindNodeCallback'
import {map as rxMap} from 'rxjs/operators'
import {compose, nth, match, head, unless} from 'ramda'

import {isYoutubeUrl} from './is-youtube-url'

const exec$ = bindNodeCallback(exec)

const getVideoName = compose(nth(1), match(/Destination: (.*\.mp3)/))

const createYoutubeUrl = (youtubeIdOrUrl) => `https://www.youtube.com/watch?v=${youtubeIdOrUrl}`
const getYoutubeUrl = unless(isYoutubeUrl, createYoutubeUrl)

export const downloadYoutubeMp3$ = (youtubeId) => exec$(`youtube-dl -x --audio-format mp3 ${getYoutubeUrl(youtubeId)}`)
  .pipe(rxMap(compose(getVideoName, head)))

