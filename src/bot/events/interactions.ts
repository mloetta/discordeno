import { commandOptionsParser, InteractionTypes } from "discordeno";
import { bot } from "../bot";

export const interactionCreate: typeof bot.events.interactionCreate = async (interaction) => {
  if (interaction.type === InteractionTypes.ApplicationCommand) {
    if (!interaction.data) return;

    const command = bot.commands.get(interaction.data.name);
    if (!command) return;

    if (command.acknowledge ?? true) {
      await interaction.defer();
    }

    try {
      await command.run(interaction, commandOptionsParser(interaction));
    } catch (e) {
      console.error(e);
      return
    }
  }
}