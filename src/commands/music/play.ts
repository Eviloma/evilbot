import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  Guild,
  GuildMember,
  type GuildTextBasedChannel,
  PermissionsBitField,
} from 'discord.js';
import { forEach } from 'lodash';

import type Client from '@/classes/Client';
import MusicCommand from '@/classes/commands/Music';
import Category from '@/enums/Category';
import DefaultEmbed, { ErrorEmbed, WarningEmbed } from '@/utils/discord-embeds';
import EmbedTitles from '@/utils/embed-titles';

export default class Play extends MusicCommand {
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

  async MusicCommandExecute(interaction: ChatInputCommandInteraction) {
    const guild = interaction.guild as Guild;
    const member = interaction.member as GuildMember;
    const channel = interaction.channel as GuildTextBasedChannel;
    const bot = guild.members.me as GuildMember;

    const track = interaction.options.getString('track', true);

    const musicChannelId = this.client.GetSetting('music_channel_id');

    await this.NullCheck(interaction);
    await this.MusicChannelCheck(channel.id, musicChannelId);
    await this.UserVoiceChannelCheck(member, bot);

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
