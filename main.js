import commander from 'commander'
import {prop} from 'ramda'

import {version} from './package.json'
import {playYoutubeMediaOnSonosSpeaker$} from './helpers/play-youtube-media-on-sonos-speaker'

const program = commander
  .name('youtube-sonos')
  .version(version)
  .description('Play youtube content on sonos speakers both -y and -s are required')
  .option('-y, --youtube <url/id>', 'Youtube url or video ID')
  .option('-s, --speaker-name <name>', 'Sonos speaker name')
  .parse(process.argv)

if (!commander.speakerName)
  return commander.missingArgument('speaker-name')
else if (!commander.youtube)
  return commander.missingArgument('youtube')

playYoutubeMediaOnSonosSpeaker$(commander.speakerName, commander.youtube)
  .subscribe((devices) => {
    console.log('Success', devices.map(prop('name')))

    process.exit(1)
  })
