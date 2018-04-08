import commander from 'commander'

import {version} from './package.json'
import {playYoutubeMediaOnSonosSpeaker$} from './helpers/sonos/play-youtube-media-on-speaker'
import {switchToLineIn$} from './helpers/sonos/switch-to-line-in'

const program = commander
  .name('youtube-sonos')
  .version(version)
  .description('Play youtube content on sonos speakers both -y and -s are required')
  .option('-y, --youtube [url/id]', 'Youtube url or video ID')
  .option('-s, --speaker-name <name>', 'Sonos speaker name (required)')
  .option('-l, --line-in', 'Switch speaker to line-in')
  .parse(process.argv)

const runPlayCommand = () => {
  if (!commander.speakerName || !commander.youtube) {
    commander.help()

    return process.exit(0)
  }

  return playYoutubeMediaOnSonosSpeaker$(commander.speakerName, commander.youtube)
}

const runBackToLineIn = () => {
  if (!commander.speakerName) {
    commander.help()

    return process.exit(0)
  }

  return switchToLineIn$(commander.speakerName)
}

(program.lineIn ? runBackToLineIn() : runPlayCommand())
  .subscribe((device) => {
    console.log('Success', device.name)

    process.exit(1)
  }, (error) => {
    console.error(error.message)

    process.exit(0)
  })
