import type { CreateContextApplicationCommand, Interaction } from "discordeno";

export interface ContextMenu extends CreateContextApplicationCommand {
  run(interaction: Interaction, args: Record<string, any>): Promise<any>
}