import type { ButtonInteraction, CacheType } from "discord.js";

import Button from "@/classes/Button";
import type Client from "@/classes/Client";
import DefaultEmbed, { ErrorEmbed, WarningEmbed } from "@/utils/discord-embeds";
import EmbedTitles from "@/utils/embed-titles";

export default class Resume extends Button {
  constructor(client: Client) {
    super(client, "music-resume");
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

    player.pause(false);
    const embed = DefaultEmbed(this.client).setTitle(EmbedTitles.music).setDescription("▶️ Відтворення відновлено.");

    interaction.reply({ embeds: [embed], ephemeral: true });
  }
}
