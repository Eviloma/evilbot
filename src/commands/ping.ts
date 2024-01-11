import { ChatInputCommandInteraction, PermissionsBitField } from 'discord.js';

import Client from '../classes/Client';
import Command from '../classes/Command';
import Category from '../enums/Category';

export default class Ping extends Command {
  constructor(client: Client) {
    super(client, {
      name: 'ping',
      description: 'Ping!',
      category: Category.Utilities,
      options: [],
      default_member_permissions: PermissionsBitField.Flags.UseApplicationCommands,
      dm_permission: false,
    });
  }

  Execute(interaction: ChatInputCommandInteraction) {
    interaction.reply({ content: `Uptime: ${this.client.uptime}!`, ephemeral: true });
  }
}
