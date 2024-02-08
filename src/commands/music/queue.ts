import { ChatInputCommandInteraction, EmbedBuilder, GuildMember, PermissionsBitField } from 'discord.js';
import { forEach, slice } from 'lodash';
import plural from 'plurals-cldr';

import Client from '../../classes/Client';
import Command from '../../classes/Command';
import Category from '../../enums/Category';
import { ErrorEmbed, WarningEmbed } from '../../libs/discord-embeds';
import EmbedTitles from '../../libs/embed-titles';
import env from '../../libs/env';
import plurals from '../../libs/plurals';

export default class Queue extends Command {
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

  async Execute(interaction: ChatInputCommandInteraction) {
    const { guild, channel } = interaction;
    const member = interaction.member as GuildMember | null;

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
      interaction.editReply({ embeds: [WarningEmbed(this.client, EmbedTitles.music, 'Наразі черга пуста.')] });
      return;
    }

    let data = '';

    forEach(slice(player.queue, 0, 10), (song, id) => {
      data += `**${id + 1}.** ${song.title} - ${song.author}\n`;
    });
    if (player.queue.length > 10) {
      data += `\nта ще **${player.queue.length - 10}** ${plurals.track[plural('uk', player.queue.length - 10) ?? '']}`;
    }
    const embed = new EmbedBuilder()
      .setColor(0x56_20_c0)
      .setTitle(EmbedTitles.music)
      .setDescription(data)
      .setTimestamp();
    interaction.editReply({ embeds: [embed] });
  }
}
