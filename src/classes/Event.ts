import type { Events } from "discord.js";

import type IEvent from "../interfaces/IEvent";
import type IEventOptions from "../interfaces/IEventOptions";
import type Client from "./Client";

export default class Event implements IEvent {
  client: Client;

  name: Events;

  description: string;

  once: boolean;

  constructor(client: Client, options: IEventOptions) {
    this.client = client;
    this.name = options.name;
    this.description = options.description;
    this.once = options.once;
  }

  async Execute(...arguments_: unknown[]) {
    throw new Error(`Execute not implemented. Args: ${JSON.stringify(arguments_)}`);
  }
}
