import { Events } from 'discord.js';

import IEvent from '../interfaces/IEvent';
import IEventOptions from '../interfaces/IEventOptions';
import Client from './Client';

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Execute(...args: unknown[]): void {}
}
