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
import MusicControllerUpdate from '../../libs/music-controller-update';

export default class Loop extends Command {
  constructor(client: Client) {
    super(client, {
      name: 'loop',
      description: 'Set loop status',
      category: Category.Music,
      options: [
        {
          name: 'status',
          description: 'Set loop status',
          type: ApplicationCommandOptionType.String,
          choices: [
            {
              name: 'Off',
              value: 'none',
            },
            {
              name: 'Queue',
              value: 'queue',
            },
            {
              name: 'One track',
              value: 'track',
            },
          ],
          required: true,
        },
      ],
      default_member_permissions: PermissionsBitField.Flags.UseApplicationCommands,
      dm_permission: false,
    });
  }

  async Execute(interaction: ChatInputCommandInteraction) {
    const { guild, channel } = interaction;
    const member = interaction.member as GuildMember | null;
    const loopStatus = interaction.options.getString('status', true) as 'none' | 'queue' | 'track';
    const musicChannelId = this.client.GetSetting('music_channel_id');

    if (!guild || !member || !channel) {
      interaction.reply({
        embeds: [ErrorEmbed(this.client, EmbedTitles.music, 'Помилка обробки команди')],
        ephemeral: true,
      });
      return;
    }

    if (musicChannelId && channel?.id !== musicChannelId) {
      interaction.reply({
        embeds: [
          ErrorEmbed(
            this.client,
            EmbedTitles.music,
            `Ви можете використовувати цю команду тільки в ${this.client.channels.cache.get(musicChannelId)}`
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

    player.setLoop(loopStatus);
    await MusicControllerUpdate(this.client, player, player.queue.current);

    const embed = DefaultEmbed(this.client).setTitle(EmbedTitles.music);

    switch (loopStatus) {
      case 'none': {
        embed.setDescription('🔁 Повтор вимкнено');
        break;
      }
      case 'queue': {
        embed.setDescription('🔁 Змінено на повтор списка відтвороення');
        break;
      }
      case 'track': {
        embed.setDescription('🔁 Змінено на повтор однієї пісні');
        break;
      }
      default: {
        break;
      }
    }
    interaction.editReply({ embeds: [embed] });
  }
}
