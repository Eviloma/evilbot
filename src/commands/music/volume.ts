import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  GuildMember,
  PermissionsBitField,
} from 'discord.js';

import Client from '../../classes/Client';
import Command from '../../classes/Command';
import Category from '../../enums/Category';
import DefaultEmbed, { ErrorEmbed, WarningEmbed } from '../../libs/discord-embeds';
import EmbedTitles from '../../libs/embed-titles';
import env from '../../libs/env';

export default class Volume extends Command {
  constructor(client: Client) {
    super(client, {
      name: 'volume',
      description: 'Set the volume',
      category: Category.Music,
      options: [
        {
          name: 'volume',
          description: 'Set the volume',
          type: ApplicationCommandOptionType.Integer,
          required: true,
          min_value: 0,
          max_value: 100,
        },
      ],
      default_member_permissions: PermissionsBitField.Flags.UseApplicationCommands,
      dm_permission: false,
    });
  }

  async Execute(interaction: ChatInputCommandInteraction) {
    const { guild, options, channel } = interaction;
    const member = interaction.member as GuildMember | null;

    const volume = options.getInteger('volume', true);

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

    if (!player || !player.queue || !player.queue.current) {
      interaction.editReply({ embeds: [WarningEmbed(this.client, EmbedTitles.music, 'Наразі черга пуста.')] });
      return;
    }

    player.setVolume(volume);
    const embed = DefaultEmbed(this.client)
      .setTitle(EmbedTitles.music)
      .setDescription(`🔊 Гучність змінена на ${volume}%`);
    interaction.editReply({ embeds: [embed] });
  }
}
