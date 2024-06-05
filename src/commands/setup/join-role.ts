import type { ChatInputCommandInteraction } from "discord.js";

import type Client from "@/classes/Client";
import SetupSubCommand from "@/classes/commands/SetupSubCommand";

export default class SetupMusicChannel extends SetupSubCommand {
  constructor(client: Client) {
    super(client, {
      name: "setup.join-role",
    });
  }

  async Execute(interaction: ChatInputCommandInteraction) {
    const role = interaction.options.getRole("role");
    await interaction.reply({
      content: "Updating join role...",
      fetchReply: true,
      ephemeral: true,
    });

    if (!role) {
      this.UpdateDatabaseKeySetting("join_role_id", null);
      await interaction.editReply({
        content: "Join role disabled",
      });
      return;
    }
    await this.UpdateDatabaseKeySetting("join_role_id", role.id);
    await interaction.editReply({
      content: `Join role set to <@&${role.id}>`,
    });
  }
}
