import type { ChatInputCommandInteraction } from "discord.js";

import type Client from "@/classes/Client";

export default interface ISubCommand {
  client: Client;
  name: string;

  Execute(interaction: ChatInputCommandInteraction): void;
}
