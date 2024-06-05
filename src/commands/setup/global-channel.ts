import { ChannelType, type ChatInputCommandInteraction, type GuildChannel } from "discord.js";

import type Client from "@/classes/Client";
import SetupSubCommand from "@/classes/commands/SetupSubCommand";
import { ErrorEmbed } from "@/utils/discord-embeds";
import EmbedTitles from "@/utils/embed-titles";

export default class SetupGlobalChannel extends SetupSubCommand {
  constructor(client: Client) {
    super(client, {
      name: "setup.global-channel",
    });
  }

  async Execute(interaction: ChatInputCommandInteraction) {
    const channel = interaction.options.getChannel("channel") as GuildChannel;

    await interaction.reply({
      content: "Updating global channel...",
      fetchReply: true,
      ephemeral: true,
    });

    if (!channel) {
      this.UpdateDatabaseKeySetting("global_channel_id", null);
      await interaction.editReply({
        content: "Global channel disabled",
      });
      return;
    }

    if (channel.type !== ChannelType.GuildText) {
      interaction.editReply({
        embeds: [ErrorEmbed(this.client, EmbedTitles.setup, "Channel must be a text channel")],
      });
      return;
    }
    await this.UpdateDatabaseKeySetting("global_channel_id", channel.id);
    await interaction.editReply({
      content: `Global channel set to <#${channel.id}>`,
    });
  }
}
