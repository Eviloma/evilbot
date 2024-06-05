import {
  ApplicationCommandOptionType,
  ChannelType,
  type ChatInputCommandInteraction,
  type GuildMember,
  PermissionsBitField,
} from "discord.js";
import plural from "plurals-cldr";

import type Client from "@/classes/Client";
import Command from "@/classes/Command";
import Category from "@/enums/Category";
import DefaultEmbed, { ErrorEmbed } from "@/utils/discord-embeds";
import EmbedTitles from "@/utils/embed-titles";
import plurals from "@/utils/plurals";

export default class Clear extends Command {
  constructor(client: Client) {
    super(client, {
      name: "clear",
      description: "Clear messages",
      category: Category.Moderators,
      options: [
        {
          name: "count",
          description: "Number of messages to delete (default: 10)",
          type: ApplicationCommandOptionType.Integer,
          min: 1,
          max: 100,
        },
      ],
      default_member_permissions: PermissionsBitField.Flags.ManageChannels,
      dm_permission: false,
    });
  }

  async Execute(interaction: ChatInputCommandInteraction) {
    const { guild, options, channel } = interaction;
    const member = interaction.member as GuildMember | null;

    const count = options.getInteger("count") ?? 10;

    if (!(guild && member && channel) || channel.type !== ChannelType.GuildText) {
      interaction.reply({
        embeds: [ErrorEmbed(this.client, EmbedTitles.music, "Помилка обробки команди")],
        ephemeral: true,
      });
      return;
    }

    await channel.bulkDelete(count, true);

    const embed = DefaultEmbed(this.client)
      .setTitle(EmbedTitles.music)
      .setDescription(`🧹 Очищено ${count} ${plurals.message[plural("uk", count) ?? ""]}`);
    interaction.reply({ embeds: [embed], ephemeral: true });
  }
}
