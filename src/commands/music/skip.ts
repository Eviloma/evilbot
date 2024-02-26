import { ChatInputCommandInteraction, GuildMember, PermissionsBitField } from 'discord.js';

import Client from '../../classes/Client';
import Command from '../../classes/Command';
import Category from '../../enums/Category';
import DefaultEmbed, { ErrorEmbed, WarningEmbed } from '../../libs/discord-embeds';
import EmbedTitles from '../../libs/embed-titles';
import env from '../../libs/env';

export default class Stop extends Command {
  constructor(client: Client) {
    super(client, {
      name: 'skip',
      description: 'Skip the current track',
      category: Category.Music,
      options: [],
      default_member_permissions: PermissionsBitField.Flags.UseApplicationCommands,
      dm_permission: false,
    });
  }

  async Execute(interaction: ChatInputCommandInteraction) {
    const { guild, channel } = interaction;
    const member = interaction.member as GuildMember | null;

    if (!guild || !member || !channel) {
      interaction.reply({
        embeds: [ErrorEmbed(this.client, EmbedTitles.music, 'Помилка обробки команди')],
        ephemeral: true,
      });
      return;
    }

    if (channel?.id !== env.MUSIC_CHANNEL_ID) {
      interaction.reply({
        embeds: [
          ErrorEmbed(
            this.client,
            EmbedTitles.music,
            `Ви можете використовувати цю команду тільки в ${this.client.channels.cache.get(env.MUSIC_CHANNEL_ID)}`
          ),
        ],
        ephemeral: true,
      });
      return;
    }

    if (!member?.voice.channel) {
      interaction.reply({
        embeds: [ErrorEmbed(this.client, EmbedTitles.music, 'Ви не в голосовому каналі')],
        ephemeral: true,
      });
      return;
    }

    if (guild?.members.me?.voice.channelId && member?.voice.channelId !== guild?.members.me?.voice.channelId) {
      interaction.reply({
        embeds: [
          ErrorEmbed(
            this.client,
            EmbedTitles.music,
            `Ви повинні бути в голосовому каналі разом з ботом (${guild.members.me.voice})`
          ),
        ],
        ephemeral: true,
      });
      return;
    }

    await interaction.deferReply({ ephemeral: true });
    const player = this.client.lavalink.players.get(guild!.id);

    if (!player) {
      interaction.editReply({ embeds: [WarningEmbed(this.client, EmbedTitles.music, 'Бот не відтворює музику.')] });
      return;
    }

    player.skip();

    const embed = DefaultEmbed(this.client).setTitle(EmbedTitles.music).setDescription('⏭️ Ця пісня була пропущена');
    interaction.editReply({ embeds: [embed] });
  }
}
