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
import MusicControllerUpdate from '@/utils/music-controller-update';

export default class Loop extends MusicCommand {
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

  async MusicCommandExecute(interaction: ChatInputCommandInteraction) {
    const guild = interaction.guild as Guild;
    const member = interaction.member as GuildMember;
    const channel = interaction.channel as GuildTextBasedChannel;
    const bot = guild.members.me as GuildMember;

    const loopStatus = interaction.options.getString('status', true) as 'none' | 'queue' | 'track';

    const musicChannelId = this.client.GetSetting('music_channel_id');

    await this.NullCheck(interaction);
    await this.MusicChannelCheck(channel.id, musicChannelId);
    await this.UserVoiceChannelCheck(member, bot);

    await interaction.deferReply({ ephemeral: true });
    const player = this.client.lavalink.players.get(guild!.id) as KazagumoPlayer;

    await this.ClearQueueCheck(player);
    player.setLoop(loopStatus);
    await MusicControllerUpdate(this.client, player, player!.queue.current!);

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
