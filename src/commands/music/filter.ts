import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  Guild,
  GuildMember,
  GuildTextBasedChannel,
  PermissionsBitField,
} from 'discord.js';
import { KazagumoPlayer } from 'kazagumo';
import { capitalize, find, map } from 'lodash';

import Client from '../../classes/Client';
import MusicCommand from '../../classes/commands/Music';
import Category from '../../enums/Category';
import DefaultEmbed, { WarningEmbed } from '../../libs/discord-embeds';
import EmbedTitles from '../../libs/embed-titles';
import audioEffects from '../../libs/filters';
import MusicControllerUpdate from '../../libs/music-controller-update';

export default class Filter extends MusicCommand {
  constructor(client: Client) {
    super(client, {
      name: 'filter',
      description: 'Set filter status',
      category: Category.Music,
      options: [
        {
          name: 'filter',
          description: 'Set filter status',
          type: ApplicationCommandOptionType.String,
          choices: map(audioEffects, (e) => ({
            name: capitalize(e.key),
            value: e.key,
          })),
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

    const filter = interaction.options.getString('filter', true);

    const musicChannelId = this.client.GetSetting('music_channel_id');

    await this.NullCheck(interaction);
    await this.MusicChannelCheck(channel.id, musicChannelId);
    await this.UserVoiceChannelCheck(member, bot);

    await interaction.deferReply({ ephemeral: true });
    const player = this.client.lavalink.players.get(guild!.id) as KazagumoPlayer;

    await this.ClearQueueCheck(player);
    const filterObject = find(audioEffects, ['key', filter]);
    if (!filterObject) {
      interaction.editReply({ embeds: [WarningEmbed(this.client, EmbedTitles.music, 'Не вдалось знайти фільтр')] });
      return;
    }
    await player.shoukaku.setFilters({ ...filterObject.value, volume: player.volume });
    await MusicControllerUpdate(this.client, player, player.queue.current!);
    const embed = DefaultEmbed(this.client)
      .setTitle(EmbedTitles.music)
      .setDescription(`🎶 Змінено фільтр на ${filter}`);
    interaction.editReply({ embeds: [embed] });
  }
}
