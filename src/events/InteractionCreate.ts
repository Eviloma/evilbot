import CustomError from "@/classes/CustomError";
import type { Event } from "@/types/Event";
import { getAllCommands } from "@/utils";
import { getErrorEmbed, getWarningEmbed } from "@/utils/discord-embeds";
import { type Client, Events, type Interaction } from "discord.js";

const commands = await getAllCommands();

function getEmbed(c: Client, err: unknown) {
  console.error(err);
  if (err instanceof CustomError) {
    if (err.type === "warning") {
      return getWarningEmbed(c, err.message);
    }
    return getErrorEmbed(c, err.message);
  }
  return getErrorEmbed(c, "Something went wrong! Please try again later.");
}

const event: Event = {
  name: Events.InteractionCreate,
  execute: async (i: Interaction) => {
    if (i.isChatInputCommand()) {
      const command = commands.get(i.commandName);

      if (!command) {
        console.error(`[ERROR] Command ${i.commandName} not found!`);
        return;
      }

      try {
        await command.execute(i);
      } catch (err) {
        const embed = getEmbed(i.client, err);
        if (i.replied || i.deferred) {
          await i.followUp({ embeds: [embed], ephemeral: true });
        } else {
          await i.reply({ embeds: [embed], ephemeral: true });
        }
      }

      return;
    }

    if (i.isButton()) {
      const button = i.client.buttons.get(i.customId);

      try {
        if (button) button.execute(i);
      } catch (err) {
        const embed = getEmbed(i.client, err);
        if (i.replied || i.deferred) {
          await i.followUp({ embeds: [embed], ephemeral: true });
        } else {
          await i.reply({ embeds: [embed], ephemeral: true });
        }
      }
    }
    return;
  },
};

export default event;
