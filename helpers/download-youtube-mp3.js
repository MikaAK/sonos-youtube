import {exec} from 'child_process'
import {bindNodeCallback} from 'rxjs/observable/bindNodeCallback'
import {map as rxMap} from 'rxjs/operators'
import {compose, nth, match, head, unless, test} from 'ramda'

const exec$ = bindNodeCallback(exec)

const getVideoName = compose(nth(1), match(/Destination: (.*\.mp3)/))

const createYoutubeUrl = (youtubeIdOrUrl) => `https://www.youtube.com/watch?v=${youtubeIdOrUrl}`
const getYoutubeUrl = unless(test(/\/watch?\v=/), createYoutubeUrl)

export const downloadYoutubeMp3$ = (youtubeId) => exec$(`youtube-dl -x --audio-format mp3 ${getYoutubeUrl(youtubeId)}`)
  .pipe(rxMap(compose(getVideoName, head)))

