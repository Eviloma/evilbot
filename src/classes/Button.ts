import type { ButtonInteraction } from "discord.js";

import type IButton from "@/interfaces/IButton";

import type Client from "./Client";

export default class Button implements IButton {
  client: Client;

  id: string;

  constructor(client: Client, id: string) {
    this.client = client;
    this.id = id;
  }

  Execute(interaction: ButtonInteraction): void {
    throw new Error(`Method not implemented in ${interaction.id} button.`);
  }
}
