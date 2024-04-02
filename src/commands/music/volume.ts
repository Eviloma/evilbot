import {
  ApplicationCommandOptionType,
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

export default class Volume extends MusicCommand {
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
          min: 0,
          max: 100,
        },
      ],
      default_member_permissions: PermissionsBitField.Flags.UseApplicationCommands,
      dm_permission: false,
    });
  }

  async MusicCommandExecute(interaction: ChatInputCommandInteraction) {
    const guild = interaction.guild as Guild;
    const member = interaction.member as GuildMember;
    const channel = interaction.channel as GuildTextBasedChannel;
    const bot = guild.members.me as GuildMember;

    const volume = interaction.options.getInteger('volume', true);

    const musicChannelId = this.client.GetSetting('music_channel_id');

    await this.NullCheck(interaction);
    await this.MusicChannelCheck(channel.id, musicChannelId);
    await this.UserVoiceChannelCheck(member, bot);

    await interaction.deferReply({ ephemeral: true });
    const player = this.client.lavalink.players.get(guild!.id) as KazagumoPlayer;

    await this.ClearQueueCheck(player);

    player.setVolume(volume);
    const embed = DefaultEmbed(this.client)
      .setTitle(EmbedTitles.music)
      .setDescription(`🔊 Гучність змінена на ${volume}%`);
    interaction.editReply({ embeds: [embed] });
  }
}
