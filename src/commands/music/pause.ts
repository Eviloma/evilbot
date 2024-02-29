import {
  ChatInputCommandInteraction,
  Guild,
  GuildMember,
  GuildTextBasedChannel,
  PermissionsBitField,
} from 'discord.js';
import { KazagumoPlayer } from 'kazagumo';

import Client from '../../classes/Client';
import MusicCommand from '../../classes/commands/Music';
import Category from '../../enums/Category';
import DefaultEmbed from '../../libs/discord-embeds';
import EmbedTitles from '../../libs/embed-titles';

export default class Pause extends MusicCommand {
  constructor(client: Client) {
    super(client, {
      name: 'pause',
      description: 'Pause the music',
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
    player.pause(true);

    const embed = DefaultEmbed(this.client).setTitle(EmbedTitles.music).setDescription('⏸️ Відтворення призупенено');
    interaction.editReply({ embeds: [embed] });
  }
}
