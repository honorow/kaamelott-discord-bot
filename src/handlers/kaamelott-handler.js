import { RichEmbed } from 'discord.js'
import path from 'path'
import RootHandler from './root-handler'

import kaamelottSounds from '../sounds/sounds.json'

export default class KaamelottHandler extends RootHandler {
  constructor(props) {
    super(props)

    this.dispatcher()
  }

  dispatcher() {
    switch(this.message.splitContent[1]) {
      case 'help':
        return this.helpHandler()
      case 'list':
        return this.listHandler()
      default:
        return this.soundHandler()
    }
  }

  helpHandler() {
    this.message.channel.send(`
\`!kaamelott list\`: Liste des sons
\`!kaamelott <son>\`: Jouer un son (ne pas mettre le .mp3)
    `)
  }

  listHandler() {
    kaamelottSounds.map(sound => this.message.author.send(new RichEmbed({
      title: sound.title,
      description: `\`${sound.file}\``,
      fields: [
        {
          inline: true,
          name: 'Personnage',
          value: sound.character,
        },
        {
          inline: true,
          name: 'Épisode',
          value: sound.episode,
        }
      ]
    })))
  }

  soundHandler() {
    const sound = `${this.message.splitContent[1]}.mp3`
    const { voiceChannel } = this.message.member
    voiceChannel.join()
      .then(connection => {
        const dispatcher = connection.playFile(path.resolve(`src/sounds/${sound}`))
        dispatcher.on('end', () => voiceChannel.leave())
      })
  }
}