import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  GuildMember,
  PermissionsBitField,
} from 'discord.js';
import { forEach } from 'lodash';

import Client from '../../classes/Client';
import Command from '../../classes/Command';
import Category from '../../enums/Category';
import DefaultEmbed, { ErrorEmbed, WarningEmbed } from '../../libs/discord-embeds';
import EmbedTitles from '../../libs/embed-titles';
import env from '../../libs/env';

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
    const track = options.getString('track', true);

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
            `Бот використовується в іншому голосовому каналі (${guild.members.me.voice})`
          ),
        ],
        ephemeral: true,
      });
      return;
    }

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
            embeds: [ErrorEmbed(this.client, EmbedTitles.music, `Не вдалось створити плеєр.`)],
          });
          return null;
        }));

    if (!player) return;

    const result = await this.client.lavalink.search(track, { requester: member });
    if (result.tracks.length === 0) {
      interaction.editReply({
        embeds: [WarningEmbed(this.client, EmbedTitles.music, 'Трек не знайдено')],
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

    const embed = DefaultEmbed(this.client).setTitle(EmbedTitles.music);

    embed.setDescription(
      result.type === 'PLAYLIST'
        ? `🎶 Додано ${result.tracks.length} публікації з ${result.playlistName}`
        : `🎶 Додано ${result.tracks[0].title}`
    );
    interaction.editReply({ embeds: [embed] });
  }
}
