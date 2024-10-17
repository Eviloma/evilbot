import type { Event } from "@/types/Event";
import { getAllCommands } from "@/utils";
import { Events, type Interaction } from "discord.js";

const commands = await getAllCommands();

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
        console.error(`[ERROR] Error executing command ${i.commandName}:`, err);
        if (i.replied || i.deferred) {
          await i.editReply({ content: "There was an error while executing this command!", ephemeral: true });
        } else {
          await i.reply({ content: "There was an error while executing this command!", ephemeral: true });
        }
      }

      return;
    }
    return;
  },
};

export default event;
