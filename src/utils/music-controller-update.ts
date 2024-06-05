import { ButtonStyle, type Message } from "discord.js";
import { Button, Row } from "easy-discord-components";
import { noop } from "lodash";

import type Client from "@/classes/Client";
import type { Player } from "poru";
import DefaultEmbed from "./discord-embeds";
import EmbedTitles from "./embed-titles";

let musicMessage: Message | null = null;

export default async function MusicControllerUpdate(client: Client, player: Player) {
  const nowPlayingTrack = player.currentTrack;

  musicMessage?.delete().catch(noop);

  if (!(player && nowPlayingTrack && player.isConnected)) return;

  const row = Row([
    Button({
      customId: "music-resume",
      label: "▶️",
      style: ButtonStyle.Success,
    }),
    Button({
      customId: "music-pause",
      label: "⏸️",
      style: ButtonStyle.Secondary,
    }),
    Button({
      customId: "music-skip",
      label: "⏩",
      style: ButtonStyle.Primary,
    }),
    Button({
      customId: "music-loop",
      label: "🔁",
      style: ButtonStyle.Primary,
    }),
    Button({
      customId: "music-stop",
      label: "⏹️",
      style: ButtonStyle.Danger,
    }),
  ]);

  const embed = DefaultEmbed(client)
    .setTitle(EmbedTitles.music)
    .setDescription(
      `**Зараз грає**: [${nowPlayingTrack.info.title}](${nowPlayingTrack.info.uri})\n**Автор**: ${nowPlayingTrack.info.author}\n\n **Ввімкнено за запитом**: ${nowPlayingTrack.info.requester}\n\n**Статус повтору**: ${player.loop === "NONE" ? "Вимкнено" : player.loop === "QUEUE" ? "Список відтворення" : "Один трек"}`,
    )
    .setImage(nowPlayingTrack.info.artworkUrl ?? null);

  const musicChannel = client.channels.cache.get(client.GetSetting("music_channel_id") ?? "");

  if (!musicChannel?.isTextBased()) return;

  await musicChannel
    .send({
      embeds: [embed],
      components: [row],
    })
    .then((x) => {
      musicMessage = x;
    });
}
