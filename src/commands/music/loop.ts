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
import MusicControllerUpdate from '../../libs/music-controller-update';

const EMBED_TITLE = '🎵 Evilbot Music';

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
    const { guild, options, channel } = interaction;
    const member = interaction.member as GuildMember | null;

    const loopStatus = options.getString('status', true) as 'none' | 'queue' | 'track';

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

    player.setLoop(loopStatus);
    await MusicControllerUpdate(this.client, player, player.queue.current);

    const embed = new EmbedBuilder().setColor(0x56_20_c0).setTitle(EMBED_TITLE).setTimestamp();

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
