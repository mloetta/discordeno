import type { ChatInput } from "../../../helpers/chatInput";

export const command: ChatInput = {
  name: "ping",
  description: "Replies with Pong!",
  acknowledge: true,
  async run(interaction, args) {
    await interaction.respond('Pong!')
  },
}