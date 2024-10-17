import type { Event } from "@/types/Event";
import { type Client, Events } from "discord.js";

const event: Event = {
  name: Events.ClientReady,
  once: true,
  execute: async (c: Client) => {
    console.info(`Logged in as ${c.user?.tag}!`);
  },
};

export default event;
