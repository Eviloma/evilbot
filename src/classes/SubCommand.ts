import { CacheType, ChatInputCommandInteraction } from 'discord.js';

import ISubCommand from '../interfaces/ISubCommand';
import ISubCommandOptions from '../interfaces/ISubCommandOptions';
import Client from './Client';

export default class SubCommand implements ISubCommand {
  client: Client;

  name: string;

  constructor(client: Client, options: ISubCommandOptions) {
    this.client = client;
    this.name = options.name;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Execute(interaction: ChatInputCommandInteraction<CacheType>): void {}
}
