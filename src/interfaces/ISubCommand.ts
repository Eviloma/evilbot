import { ChatInputCommandInteraction } from 'discord.js';

import Client from '../classes/Client';

export default interface ISubCommand {
  client: Client;
  name: string;

  Execute(interaction: ChatInputCommandInteraction): void;
}
