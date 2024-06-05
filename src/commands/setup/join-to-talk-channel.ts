import { ChannelType, type ChatInputCommandInteraction, type GuildChannel } from "discord.js";

import type Client from "@/classes/Client";
import SetupSubCommand from "@/classes/commands/SetupSubCommand";
import { ErrorEmbed } from "@/utils/discord-embeds";
import EmbedTitles from "@/utils/embed-titles";

export default class JoinToTalkChannel extends SetupSubCommand {
  constructor(client: Client) {
    super(client, {
      name: "setup.join-to-talk-channel",
    });
  }

  async Execute(interaction: ChatInputCommandInteraction) {
    const channel = interaction.options.getChannel("channel") as GuildChannel;
    await interaction.reply({
      content: "Updating join to talk channel...",
      fetchReply: true,
      ephemeral: true,
    });

    if (!channel) {
      this.UpdateDatabaseKeySetting("join_to_talk_channel_id", null);
      await interaction.editReply({
        content: "Join to talk channel disabled",
      });
      return;
    }

    if (channel.type !== ChannelType.GuildVoice) {
      interaction.editReply({
        embeds: [ErrorEmbed(this.client, EmbedTitles.setup, "Channel must be a voice channel")],
      });
      return;
    }
    await this.UpdateDatabaseKeySetting("join_to_talk_channel_id", channel.id);
    await interaction.editReply({
      content: `Join to talk channel set to <#${channel.id}>`,
    });
  }
}
