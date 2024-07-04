import { ButtonStyle } from "discord.js";
import { Button, Row } from "easy-discord-components";

export const musicControllRow = Row([
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
