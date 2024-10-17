import type { Client } from "discord.js";
import { getAllEvents } from ".";

export async function registerClientEvents(client: Client) {
  const events = await getAllEvents("client");

  for (const event of events) {
    if (event.once) {
      client.once(event.name, event.execute);
    } else {
      client.on(event.name, event.execute);
    }
  }

  console.info("[INFO] Registered all client events!");
}
