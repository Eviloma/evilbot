import {
  ChatInputCommandInteraction,
  Guild,
  GuildMember,
  GuildTextBasedChannel,
  PermissionsBitField,
} from 'discord.js';
import { KazagumoPlayer } from 'kazagumo';
import { forEach, slice } from 'lodash';
import plural from 'plurals-cldr';

import Client from '../../classes/Client';
import MusicCommand from '../../classes/commands/Music';
import Category from '../../enums/Category';
import DefaultEmbed from '../../libs/discord-embeds';
import EmbedTitles from '../../libs/embed-titles';
import plurals from '../../libs/plurals';

export default class Queue extends MusicCommand {
  constructor(client: Client) {
    super(client, {
      name: 'queue',
      description: 'Show the music queue',
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

    let data = '';

    forEach(slice(player.queue, 0, 10), (song, id) => {
      data += `**${id + 1}.** ${song.title} - ${song.author}\n`;
    });
    if (player.queue.length > 10) {
      data += `\nта ще **${player.queue.length - 10}** ${plurals.track[plural('uk', player.queue.length - 10) ?? '']}`;
    }
    const embed = DefaultEmbed(this.client).setTitle(EmbedTitles.music).setDescription(data);
    interaction.editReply({ embeds: [embed] });
  }
}
