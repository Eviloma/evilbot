import { ButtonInteraction, CacheType, EmbedBuilder } from 'discord.js';

import Button from '../../classes/Button';
import Client from '../../classes/Client';
import { ErrorEmbed, WarningEmbed } from '../../libs/discord-embeds';
import EmbedTitles from '../../libs/embed-titles';
import MusicControllerUpdate from '../../libs/music-controller-update';

export default class Loop extends Button {
  constructor(client: Client) {
    super(client, 'music-loop');
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

    const loopStatus = player.loop;
    const embed = new EmbedBuilder().setTitle(EmbedTitles.music).setColor(0x56_20_c0).setTimestamp();

    switch (loopStatus) {
      case 'none': {
        player.setLoop('queue');
        embed.setDescription('🔁 Змінено на повтор списка відтвороення');
        break;
      }
      case 'queue': {
        player.setLoop('track');
        embed.setDescription('🔁 Змінено на повтор однієї пісні');
        break;
      }
      default: {
        player.setLoop('none');
        embed.setDescription('🔁 Повтор вимкнено');
        break;
      }
    }

    await MusicControllerUpdate(this.client, player, player.queue.current);

    interaction.reply({ embeds: [embed], ephemeral: true });
  }
}
