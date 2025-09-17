import { Collection } from "discordeno";
import type { ChatInput } from "../helpers/chatInput";
import type { ContextMenu } from "../helpers/contextMenu";
import { ReadDirectory } from "../utils/utils";
import { rest } from "../rest/rest";

const cache = new Collection<string, ChatInput & ContextMenu>()
const commands = await ReadDirectory('./commands');
for (const command of commands) {
  cache.set(command.name, command)
}

await rest.upsertGlobalApplicationCommands(Array.from(cache.values()))