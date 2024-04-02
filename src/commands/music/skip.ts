import {
  ChatInputCommandInteraction,
  Guild,
  GuildMember,
  type GuildTextBasedChannel,
  PermissionsBitField,
} from 'discord.js';
import type { KazagumoPlayer } from 'kazagumo';

import type Client from '@/classes/Client';
import MusicCommand from '@/classes/commands/Music';
import Category from '@/enums/Category';
import DefaultEmbed from '@/utils/discord-embeds';
import EmbedTitles from '@/utils/embed-titles';

export default class Stop extends MusicCommand {
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

  async MusicCommandExecute(interaction: ChatInputCommandInteraction) {
    const guild = interaction.guild as Guild;
    const member = interaction.member as GuildMember;
    const channel = interaction.channel as GuildTextBasedChannel;
    const bot = guild.members.me as GuildMember;

    const musicChannelId = this.client.GetSetting('music_channel_id');

    await this.NullCheck(interaction);
    await this.MusicChannelCheck(channel.id, musicChannelId);
    await this.UserVoiceChannelCheck(member, bot);

    await interaction.deferReply({ ephemeral: true });
    const player = this.client.lavalink.players.get(guild!.id) as KazagumoPlayer;

    await this.ClearQueueCheck(player);
    player.skip();

    const embed = DefaultEmbed(this.client).setTitle(EmbedTitles.music).setDescription('⏭️ Ця пісня була пропущена');
    interaction.editReply({ embeds: [embed] });
  }
}
