import type { CreateContextApplicationCommand } from "discordeno";
import type { Interaction } from "../types/types";

export interface ContextMenu extends CreateContextApplicationCommand {
  acknowledge?: boolean
  run(interaction: Interaction, args: Record<string, any>): any
}