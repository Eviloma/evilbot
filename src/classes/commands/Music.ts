import type { ChatInputCommandInteraction, GuildMember } from "discord.js";

import { ErrorEmbed, WarningEmbed } from "@/utils/discord-embeds";
import EmbedTitles from "@/utils/embed-titles";

import type { Player } from "poru";
import Command from "../Command";
import CustomError from "../CustomError";

export default class MusicCommand extends Command {
  async Execute(interaction: ChatInputCommandInteraction) {
    try {
      await this.MusicCommandExecute(interaction);
    } catch (error) {
      if (error instanceof CustomError) {
        await (error.type === "error"
          ? interaction.editReply({
              embeds: [ErrorEmbed(this.client, EmbedTitles.music, error.message)],
            })
          : interaction.editReply({
              embeds: [WarningEmbed(this.client, EmbedTitles.music, error.message)],
            }));
      } else {
        interaction.editReply({
          embeds: [ErrorEmbed(this.client, EmbedTitles.music, "Помилка обробки команди")],
        });
      }
    }
  }

  async MusicCommandExecute(interaction: ChatInputCommandInteraction) {
    throw new Error(`Execute not implemented in ${interaction.command?.name} MusicCommand`);
  }

  protected async NullCheck(interaction: ChatInputCommandInteraction) {
    if (!(interaction.guild && interaction.member && interaction.channel && interaction.guild.members.me)) {
      throw new CustomError("Помилка обробки команди", "error");
    }
  }

  protected async MusicChannelCheck(channel?: string, music_channel?: string) {
    if (music_channel && channel !== music_channel) {
      throw new CustomError(
        `Ви можете використовувати цю команду тільки в ${this.client.channels.cache.get(music_channel)}`,
        "error",
      );
    }
  }

  protected async UserVoiceChannelCheck(member: GuildMember, bot: GuildMember) {
    if (!member.voice.channel) {
      throw new CustomError("Ви не в голосовому каналі", "error");
    }

    if (bot.voice.channel && member.voice.channelId !== bot.voice.channelId) {
      throw new CustomError(`Ви повинні бути в голосовому каналі разом з ботом (${bot.voice.channel})`, "error");
    }
  }

  protected async ClearQueueCheck(player?: Player) {
    if (!player?.queue || player.queue.length === 0) {
      throw new CustomError("Наразі черга пуста.", "warning");
    }
  }
}
