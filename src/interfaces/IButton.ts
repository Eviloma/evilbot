import type { ButtonInteraction } from "discord.js";

import type Client from "@/classes/Client";

export default interface IButton {
  client: Client;
  id: string;

  Execute(interaction: ButtonInteraction): void;
}
