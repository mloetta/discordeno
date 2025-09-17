import { Collection, createBot, type DesiredPropertiesBehavior, type EventHandlers, type TransformersDesiredProperties } from "discordeno";
import { ReadDirectory } from "../utils/utils";
import type { ChatInput } from "../helpers/chatInput";
import type { ContextMenu } from "../helpers/contextMenu";
import { GATEWAY_URL, AUTHORIZATION, TOKEN, REST_URL } from "../utils/variables";
import { join } from "path";

declare module 'discordeno' {
  interface Bot {
    commands: Collection<string, ChatInput & ContextMenu>
  }
}

export const bot = createBot({
  token: TOKEN,
  rest: {
    proxy: {
      baseUrl: REST_URL,
      authorization: AUTHORIZATION
    },
  }
})

// @ts-ignore
bot.gateway.requestMembers = async function (guildId, options) {
  await fetch(GATEWAY_URL, {
    method: 'POST',
    headers: {
      authorization: AUTHORIZATION,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ type: "REQUEST_MEMBERS", guildId, options })
  })
    .then(res => res.text())
    .catch(() => undefined)
}

const events = await ReadDirectory(join(__dirname, './events'));
bot.events = events.reduce((acc, mod) => {
  if (mod.name && mod.handler) {
    acc[mod.name] = mod.handler
  }

  return acc
}, {} as Partial<EventHandlers<TransformersDesiredProperties, DesiredPropertiesBehavior.RemoveKey>>)

const commands = await ReadDirectory(join(__dirname, './commands'));
bot.commands = new Collection();

for (const command of commands) {
  if (command.name) {
    bot.commands.set(command.name, command);
  }
}