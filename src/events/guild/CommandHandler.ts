import { ChatInputCommandInteraction, Collection, Events } from 'discord.js';

import Client from '../../classes/Client';
import Command from '../../classes/Command';
import Event from '../../classes/Event';
import { ErrorEmbed } from '../../libs/discord-embeds';
import logger from '../../libs/logger';

export default class CommandHadler extends Event {
  constructor(client: Client) {
    super(client, {
      name: Events.InteractionCreate,
      description: 'Command Handler',
      once: false,
    });
  }

  async Execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.isChatInputCommand()) return;

    const command: Command | undefined = this.client.commands.get(interaction.commandName);

    if (!command) {
      await interaction.reply({
        content: 'Command not found',
        ephemeral: true,
      });
      this.client.commands.delete(interaction.commandName);
      return;
    }

    const { cooldowns } = this.client;
    if (!cooldowns.has(command.name)) {
      cooldowns.set(command.name, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown ?? 3) * 1000;

    if (timestamps?.has(interaction.user.id) && now < (timestamps.get(interaction.user.id) ?? 0) + cooldownAmount) {
      await interaction.reply({
        embeds: [ErrorEmbed(this.client, 'Cooldown', 'You are on cooldown, please wait')],
        ephemeral: true,
      });
      return;
    }

    timestamps?.set(interaction.user.id, now);

    setTimeout(() => {
      timestamps?.delete(interaction.user.id);
    }, cooldownAmount);

    try {
      const subCommandGroup = interaction.options.getSubcommandGroup(false);
      let subCommand = `${interaction.commandName}`;
      if (subCommandGroup) subCommand += `.${subCommandGroup}`;
      subCommand += `.${interaction.options.getSubcommand(false)}`;

      const { subCommands } = this.client;
      if (subCommands.has(subCommand)) {
        subCommands.get(subCommand)?.Execute(interaction);
      } else {
        command.Execute(interaction);
      }
    } catch (error) {
      logger.error(error);
    }
  }
}
