import { ButtonInteraction, CacheType } from 'discord.js';

import Button from '../../classes/Button';
import Client from '../../classes/Client';
import DefaultEmbed, { ErrorEmbed, WarningEmbed } from '../../libs/discord-embeds';
import EmbedTitles from '../../libs/embed-titles';

export default class Pause extends Button {
  constructor(client: Client) {
    super(client, 'music-pause');
  }

  async Execute(interaction: ButtonInteraction<CacheType>) {
    const { guild } = interaction;
    if (!guild) {
      interaction.reply({
        embeds: [ErrorEmbed(this.client, EmbedTitles.music, 'Помилка обробки команди')],
        ephemeral: true,
      });
      return;
    }

    const player = this.client.lavalink.players.get(guild.id);
    if (!player || !player.queue || !player.queue.current) {
      interaction.reply({
        embeds: [WarningEmbed(this.client, EmbedTitles.music, 'Наразі черга пуста.')],
        ephemeral: true,
      });
      return;
    }

    player.pause(true);
    const embed = DefaultEmbed(this.client).setTitle(EmbedTitles.music).setDescription('⏸️ Відтворення призупинено.');

    interaction.reply({ embeds: [embed], ephemeral: true });
  }
}
