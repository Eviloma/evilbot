import type { Events } from "discord.js";

import type Client from "@/classes/Client";

export default interface IEvent {
  client: Client;
  name: Events;
  description: string;
  once: boolean;
}
