import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  GuildMember,
  PermissionsBitField,
} from 'discord.js';
import { forEach } from 'lodash';

import Client from '../../classes/Client';
import Command from '../../classes/Command';
import Category from '../../enums/Category';
import { ErrorMessage, Warning } from '../../libs/discord-message';
import env from '../../libs/env';

const EMBED_TITLE = '🎵 Evilbot Music';

export default class Play extends Command {
  constructor(client: Client) {
    super(client, {
      name: 'play',
      description: 'Play a song!',
      category: Category.Music,
      options: [
        {
          name: 'track',
          description: 'The track to play',
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
      default_member_permissions: PermissionsBitField.Flags.UseApplicationCommands,
      dm_permission: false,
      cooldown: 10,
    });
  }

  async Execute(interaction: ChatInputCommandInteraction) {
    const { guild, options, channel } = interaction;
    const member = interaction.member as GuildMember | null;
    const track = options.getString('track');

    if (!guild || !member || !channel) {
      interaction.reply({
        embeds: [ErrorMessage(this.client, EMBED_TITLE, 'Помилка обробки команди')],
        ephemeral: true,
      });
      return;
    }

    if (channel?.id !== env.MUSIC_CHANNEL_ID) {
      interaction.reply({
        embeds: [
          ErrorMessage(
            this.client,
            EMBED_TITLE,
            `Ви можете використовувати цю команду тільки в ${this.client.channels.cache.get(env.MUSIC_CHANNEL_ID)}`
          ),
        ],
        ephemeral: true,
      });
      return;
    }

    if (!track) {
      interaction.reply({
        embeds: [ErrorMessage(this.client, EMBED_TITLE, 'Введіть назву або помилання на трек')],
        ephemeral: true,
      });
      return;
    }

    if (!member?.voice.channel) {
      interaction.reply({
        embeds: [ErrorMessage(this.client, EMBED_TITLE, 'Ви не в голосовому каналі')],
        ephemeral: true,
      });
      return;
    }

    if (guild?.members.me?.voice.channelId && member?.voice.channelId !== guild?.members.me?.voice.channelId) {
      interaction.reply({
        embeds: [
          ErrorMessage(
            this.client,
            EMBED_TITLE,
            `Бот використовується в іншому голосовому каналі (${guild.members.me.voice})`
          ),
        ],
        ephemeral: true,
      });
      return;
    }

    const embed = new EmbedBuilder().setColor(0x56_20_c0).setTitle(EMBED_TITLE).setTimestamp();

    await interaction.deferReply({ ephemeral: true });

    const player =
      this.client.lavalink.players.get(guild!.id) ??
      (await this.client.lavalink
        .createPlayer({
          guildId: guild.id,
          textId: channel.id,
          voiceId: member.voice.channelId!,
          volume: 25,
        })
        .catch(() => {
          interaction.editReply({
            embeds: [ErrorMessage(this.client, EMBED_TITLE, `Не вдалось створити плеєр.`)],
          });
          return null;
        }));

    if (!player) return;

    const result = await this.client.lavalink.search(track, { requester: member });
    if (result.tracks.length === 0) {
      interaction.editReply({
        embeds: [Warning(this.client, EMBED_TITLE, 'Трек не знайдено')],
      });
      return;
    }

    if (result.type === 'PLAYLIST') {
      forEach(result.tracks, (e) => player.queue.add(e));
    } else {
      player.queue.add(result.tracks[0]);
    }

    if (!player.playing) {
      await player.play();
    }

    embed.setDescription(
      result.type === 'PLAYLIST'
        ? `🎶 Додано ${result.tracks.length} публікації з ${result.playlistName}`
        : `🎶 Додано ${result.tracks[0].title}`
    );
    interaction.editReply({ embeds: [embed] });
  }
}
