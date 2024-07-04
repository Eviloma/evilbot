import type { ButtonInteraction, CacheType } from "discord.js";

import Button from "@/classes/Button";
import type Client from "@/classes/Client";
import DefaultEmbed, { ErrorEmbed, WarningEmbed } from "@/utils/discord-embeds";
import EmbedTitles from "@/utils/embed-titles";

export default class Loop extends Button {
  constructor(client: Client) {
    super(client, "music-loop");
  }

  async Execute(interaction: ButtonInteraction<CacheType>) {
    const { guild } = interaction;
    if (!guild) {
      interaction.reply({
        embeds: [ErrorEmbed(this.client, EmbedTitles.music, "Помилка обробки команди")],
        ephemeral: true,
      });
      return;
    }

    const player = this.client.lavalink.players.get(guild.id);
    if (!player?.currentTrack) {
      interaction.reply({
        embeds: [WarningEmbed(this.client, EmbedTitles.music, "Наразі черга пуста.")],
        ephemeral: true,
      });
      return;
    }

    const loopStatus = player.loop;
    const embed = DefaultEmbed(this.client).setTitle(EmbedTitles.music);

    switch (loopStatus) {
      case "NONE": {
        player.setLoop("QUEUE");
        embed.setDescription("🔁 Змінено на повтор списка відтвороення");
        break;
      }
      case "QUEUE": {
        player.setLoop("TRACK");
        embed.setDescription("🔁 Змінено на повтор однієї пісні");
        break;
      }
      default: {
        player.setLoop("NONE");
        embed.setDescription("🔁 Повтор вимкнено");
        break;
      }
    }

    await this.client.MusicControllerUpdate(player, player.currentTrack);

    interaction.reply({ embeds: [embed], ephemeral: true });
  }
}
