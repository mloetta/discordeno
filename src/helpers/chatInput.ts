import type { Bot, CreateSlashApplicationCommand } from "discordeno";
import type { Interaction } from "../types/types";

export interface ChatInput extends CreateSlashApplicationCommand {
  acknowledge?: boolean
  run(interaction: Interaction, args: Record<string, any>): any
}