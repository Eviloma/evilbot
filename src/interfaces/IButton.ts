import { ButtonInteraction } from 'discord.js';

import Client from '../classes/Client';

export default interface IButton {
  client: Client;
  id: string;

  Execute(interaction: ButtonInteraction): void;
}
