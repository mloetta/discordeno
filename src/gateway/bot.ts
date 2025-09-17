import { createBot, DiscordMessageReferenceType } from "discordeno";
import * as util from 'util'

const bot = createBot({
  token: '',
  desiredProperties: {
    user: {
      id: true,
      toggles: true
    },
    message: {
      content: true,
      author: true,
      channelId: true,
      id: true
    }
  },
  events: {
    async messageCreate(message) {
      if (message.author.bot) return

      if (message.author.id !== BigInt('')) return

      if (!message.content.startsWith('.eval')) return

      const args = message.content.split(' ')
      args.shift()

      const cleanArgs = args.join(' ').replace(/^\s+/, '').replace(/\s*$/, '')

      let result;
      try {
        result = eval(cleanArgs)
      } catch (e) {
        result = e
      }

      const response = ['```ts']
      const regex = new RegExp('', 'gi')

      if (result && typeof result.then === 'function') {
        let value
        try {
          value = await result
        } catch (e) {
          value = e;
        }

        response.push(
          util
            .inspect(value, { depth: 1 })
            .replace(regex, 'nuh uh')
            .substring(0, 1985),
        )
      } else {
        response.push(
          String(util.inspect(result))
            .replace(regex, 'nuh uh')
            .substring(0, 1985)
        )
      }

      response.push('```')

      await bot.rest.sendMessage(message.channelId, {
        messageReference: {
          type: DiscordMessageReferenceType.Default,
          messageId: message.id,
          failIfNotExists: false
        },
        content: response.join('\n')
      })
    },
  },
})