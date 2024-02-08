import { ButtonInteraction, CacheType } from 'discord.js';

import IButton from '../interfaces/IButton';
import Client from './Client';

export default class Button implements IButton {
  client: Client;

  id: string;

  constructor(client: Client, id: string) {
    this.client = client;
    this.id = id;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Execute(interaction: ButtonInteraction<CacheType>): void {}
}
