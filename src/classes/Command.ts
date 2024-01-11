import { AutocompleteInteraction, CacheType, ChatInputCommandInteraction } from 'discord.js';

import Category from '../enums/Category';
import ICommand from '../interfaces/ICommand';
import ICommandOptions from '../interfaces/ICommandOptions';
import Client from './Client';

export default class Command implements ICommand {
  client: Client;

  name: string;

  description: string;

  category: Category;

  options: object;

  default_member_permissions: bigint;

  dm_permission: boolean;

  cooldown: number;

  constructor(client: Client, options: ICommandOptions) {
    this.client = client;
    this.name = options.name;
    this.description = options.description;
    this.category = options.category;
    this.options = options.options;
    this.default_member_permissions = options.default_member_permissions;
    this.dm_permission = options.dm_permission;
    this.cooldown = options.cooldown ?? 3;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Execute(interaction: ChatInputCommandInteraction<CacheType>): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  AutoComplete(interaction: AutocompleteInteraction<CacheType>): void {}
}
