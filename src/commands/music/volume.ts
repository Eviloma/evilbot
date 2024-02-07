import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  GuildMember,
  PermissionsBitField,
} from 'discord.js';

import Client from '../../classes/Client';
import Command from '../../classes/Command';
import Category from '../../enums/Category';
import { ErrorEmbed, WarningEmbed } from '../../libs/discord-embeds';
import env from '../../libs/env';

const EMBED_TITLE = '🎵 Evilbot Music';

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
        embeds: [ErrorEmbed(this.client, EMBED_TITLE, 'Помилка обробки команди')],
        ephemeral: true,
      });
      return;
    }

    if (channel?.id !== env.MUSIC_CHANNEL_ID) {
      interaction.reply({
        embeds: [
          ErrorEmbed(
            this.client,
            EMBED_TITLE,
            `Ви можете використовувати цю команду тільки в ${this.client.channels.cache.get(env.MUSIC_CHANNEL_ID)}`
          ),
        ],
        ephemeral: true,
      });
      return;
    }

    if (!member?.voice.channel) {
      interaction.reply({
        embeds: [ErrorEmbed(this.client, EMBED_TITLE, 'Ви не в голосовому каналі')],
        ephemeral: true,
      });
      return;
    }

    if (guild?.members.me?.voice.channelId && member?.voice.channelId !== guild?.members.me?.voice.channelId) {
      interaction.reply({
        embeds: [
          ErrorEmbed(
            this.client,
            EMBED_TITLE,
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
      interaction.editReply({ embeds: [WarningEmbed(this.client, EMBED_TITLE, 'Наразі черга пуста.')] });
      return;
    }

    player.setVolume(volume);
    const embed = new EmbedBuilder()
      .setColor(0x56_20_c0)
      .setTitle(EMBED_TITLE)
      .setDescription(`🔊 Гучність змінена на ${volume}%`)
      .setTimestamp();
    interaction.editReply({ embeds: [embed] });
  }
}
