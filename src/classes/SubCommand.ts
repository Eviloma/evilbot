/* eslint-disable class-methods-use-this */
import { type CacheType, ChatInputCommandInteraction } from 'discord.js';

import type ISubCommand from '@/interfaces/ISubCommand';
import type ISubCommandOptions from '@/interfaces/ISubCommandOptions';

import type Client from './Client';

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
