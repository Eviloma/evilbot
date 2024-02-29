import { ChatInputCommandInteraction } from 'discord.js';

import Client from '../classes/Client';
import Category from '../enums/Category';

export default interface ICommand {
  client: Client;
  name: string;
  description: string;
  category: Category;
  options: object;
  default_member_permissions: bigint;
  dm_permission: boolean;
  cooldown: number;

  Execute(interaction: ChatInputCommandInteraction): Promise<void>;
}
