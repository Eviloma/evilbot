import { ChatInputCommandInteraction, GuildMember } from 'discord.js';
import { KazagumoPlayer } from 'kazagumo';

import { ErrorEmbed, WarningEmbed } from '../../libs/discord-embeds';
import EmbedTitles from '../../libs/embed-titles';
import Command from '../Command';
import CustomError from '../CustomError';

export default class MusicCommand extends Command {
  async Execute(interaction: ChatInputCommandInteraction) {
    try {
      await this.MusicCommandExecute(interaction);
    } catch (error) {
      if (error instanceof CustomError) {
        await (error.type === 'error'
          ? interaction.reply({
              embeds: [ErrorEmbed(this.client, EmbedTitles.music, error.message)],
              ephemeral: true,
            })
          : interaction.reply({
              embeds: [WarningEmbed(this.client, EmbedTitles.music, error.message)],
              ephemeral: true,
            }));
      } else {
        interaction.reply({
          embeds: [ErrorEmbed(this.client, EmbedTitles.music, 'Помилка обробки команди')],
          ephemeral: true,
        });
      }
    }
  }

  async MusicCommandExecute(interaction: ChatInputCommandInteraction) {
    throw new Error(`Execute not implemented in ${interaction.command?.name} MusicCommand`);
  }

  protected async NullCheck(interaction: ChatInputCommandInteraction) {
    if (!interaction.guild || !interaction.member || !interaction.channel || !interaction.guild.members.me) {
      throw new CustomError('Помилка обробки команди', 'error');
    }
  }

  protected async MusicChannelCheck(channel?: string, music_channel?: string) {
    if (music_channel && channel !== music_channel) {
      throw new CustomError(
        `Ви можете використовувати цю команду тільки в ${this.client.channels.cache.get(music_channel)}`,
        'error'
      );
    }
  }

  protected async UserVoiceChannelCheck(member: GuildMember, bot: GuildMember) {
    if (!member.voice.channel) {
      throw new CustomError('Ви не в голосовому каналі', 'error');
    }

    if (member.voice.channelId !== bot.voice.channelId) {
      throw new CustomError(`Ви повинні бути в голосовому каналі разом з ботом (${bot.voice})`, 'error');
    }
  }

  protected async ClearQueueCheck(player?: KazagumoPlayer) {
    if (!player || !player.queue || !player.queue.current) {
      throw new CustomError('Наразі черга пуста.', 'warning');
    }
  }
}
