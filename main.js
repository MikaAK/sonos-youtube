import commander from 'commander'
import {isNil} from 'ramda'

import {version} from './package.json'
import {
  switchToLineIn$,
  playYoutubeMediaOnSonosSpeaker$,
  addYoutubeMediaToSonosQueue$,
  flushQueue$
} from './lib/sonos'

const program = commander
  .name('youtube-sonos')
  .version(version)
  .description('Play youtube content on sonos speakers both -y and -s are required')
  .option('-y, --youtube [url/id]', 'Youtube url or video ID')
  .option('-s, --speaker-name <name>', 'Sonos speaker name (required)')
  .option('-q, --queue', 'Add to queue')
  .option('-l, --line-in', 'Switch speaker to line-in')
  .option('-c, --clear-queue', 'Clear speaker queue')
  .parse(process.argv)

const checkForArgs = (args) => {
  const areAnyNil = args.map((arg) => program[arg]).some(isNil)

  if (areAnyNil) {
    program.help()

    process.exit(0)
  }
}

const play = () => {
  checkForArgs(['speakerName', 'youtube'])

  if (program.queue)
    return addYoutubeMediaToSonosQueue$(program.speakerName, program.youtube)
  else
    return playYoutubeMediaOnSonosSpeaker$(program.speakerName, program.youtube)
}

const backToLineIn = () => {
  checkForArgs(['speakerName'])

  return switchToLineIn$(program.speakerName)
}

const clearQueue = () => {
  checkForArgs(['speakerName'])

  return flushQueue$(program.speakerName)
}

const commandList = {play, clearQueue, backToLineIn}

let command

if (program.clearQueue)
  command = 'clearQueue'
else if (program.lineIn)
  command = 'backToLineIn'
else
  command = 'play'

commandList[command]()
  .subscribe((device) => {
    console.log('Success', device.name || '')

    process.exit(1)
  }, (error) => {
    console.error(error.message)

    process.exit(0)
  })
