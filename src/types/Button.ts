import type { ButtonInteraction } from "discord.js";

export type Button = {
  id: string;
  execute: (i: ButtonInteraction) => Promise<void>;
};
