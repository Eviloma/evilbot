import { ChatInputCommandInteraction, EmbedBuilder, GuildMember, PermissionsBitField } from 'discord.js';

import Client from '../../classes/Client';
import Command from '../../classes/Command';
import Category from '../../enums/Category';
import { ErrorEmbed, WarningEmbed } from '../../libs/discord-embeds';
import env from '../../libs/env';

const EMBED_TITLE = '🎵 Evilbot Music';

export default class Pause extends Command {
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

  async Execute(interaction: ChatInputCommandInteraction) {
    const { guild, channel } = interaction;
    const member = interaction.member as GuildMember | null;

    if (!guild || !member || !channel) {
      interaction.reply({
        embeds: [ErrorEmbed(this.client, EMBED_TITLE, 'Помилка обробки команди')],
        ephemeral: true,
      });
      return;
    }

    if (channel?.id !== env.MUSIC_CHANNEL_ID) {
      interaction.reply({
        embeds: [
          ErrorEmbed(
            this.client,
            EMBED_TITLE,
            `Ви можете використовувати цю команду тільки в ${this.client.channels.cache.get(env.MUSIC_CHANNEL_ID)}`
          ),
        ],
        ephemeral: true,
      });
      return;
    }

    if (!member?.voice.channel) {
      interaction.reply({
        embeds: [ErrorEmbed(this.client, EMBED_TITLE, 'Ви не в голосовому каналі')],
        ephemeral: true,
      });
      return;
    }

    if (guild?.members.me?.voice.channelId && member?.voice.channelId !== guild?.members.me?.voice.channelId) {
      interaction.reply({
        embeds: [
          ErrorEmbed(
            this.client,
            EMBED_TITLE,
            `Ви повинні бути в голосовому каналі разом з ботом (${guild.members.me.voice})`
          ),
        ],
        ephemeral: true,
      });
      return;
    }

    await interaction.deferReply({ ephemeral: true });
    const player = this.client.lavalink.players.get(guild!.id);

    if (!player || !player.queue) {
      interaction.editReply({ embeds: [WarningEmbed(this.client, EMBED_TITLE, 'Наразі черга пуста.')] });
      return;
    }

    player.pause(true);

    const embed = new EmbedBuilder()
      .setColor(0x56_20_c0)
      .setTitle(EMBED_TITLE)
      .setDescription('⏸️ Відтворення призупенено')
      .setTimestamp();
    interaction.editReply({ embeds: [embed] });
  }
}
