import { ChannelType, type ChatInputCommandInteraction, type GuildChannel } from "discord.js";

import type Client from "@/classes/Client";
import SetupSubCommand from "@/classes/commands/SetupSubCommand";
import { ErrorEmbed } from "@/utils/discord-embeds";
import EmbedTitles from "@/utils/embed-titles";

export default class JoinToTalkChannel extends SetupSubCommand {
  constructor(client: Client) {
    super(client, {
      name: "setup.temp-voice-channels-category",
    });
  }

  async Execute(interaction: ChatInputCommandInteraction) {
    const category = interaction.options.getChannel("category") as GuildChannel;
    await interaction.reply({
      content: "Updating temp voice channels category...",
      fetchReply: true,
      ephemeral: true,
    });

    if (!category) {
      this.UpdateDatabaseKeySetting("temp_voice_channels_category_id", null);
      await interaction.editReply({
        content: "Temp voice channels category disabled",
      });
      return;
    }

    if (category.type !== ChannelType.GuildCategory) {
      interaction.editReply({
        embeds: [ErrorEmbed(this.client, EmbedTitles.setup, "Must be a category")],
      });
      return;
    }
    await this.UpdateDatabaseKeySetting("temp_voice_channels_category_id", category.id);
    await interaction.editReply({
      content: `Temp voice channels category set to <#${category.id}>`,
    });
  }
}
