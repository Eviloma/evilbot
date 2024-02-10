import { Events } from 'discord.js';

import Client from '../classes/Client';

export default interface IEvent {
  client: Client;
  name: Events;
  description: string;
  once: boolean;
}
