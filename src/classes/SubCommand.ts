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

  async Execute(interaction: ChatInputCommandInteraction<CacheType>) {
    throw new Error(`Execute not implemented in ${interaction.command?.name} subcommand`);
  }
}
