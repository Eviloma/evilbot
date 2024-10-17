import type { Command } from "@/types/Command";
import { SlashCommandBuilder } from "discord.js";

const commands: Command = {
  data: new SlashCommandBuilder().setName("ping").setDescription("Replies with Pong!"),
  async execute(i) {
    await i.reply("Pong!");
  },
};

export default commands;
