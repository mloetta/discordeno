import type { CreateSlashApplicationCommand, Interaction } from "discordeno";

export interface ChatInput extends CreateSlashApplicationCommand {
  run(interaction: Interaction, args: Record<string, any>): Promise<any>
}