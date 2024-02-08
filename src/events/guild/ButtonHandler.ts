import { ButtonInteraction, Events } from 'discord.js';

import Button from '../../classes/Button';
import Client from '../../classes/Client';
import Event from '../../classes/Event';

export default class CommandHadler extends Event {
  constructor(client: Client) {
    super(client, {
      name: Events.InteractionCreate,
      description: 'Command Handler',
      once: false,
    });
  }

  async Execute(interaction: ButtonInteraction) {
    if (!interaction.isButton()) return;

    const button: Button | undefined = this.client.buttons.get(interaction.customId);

    if (!button) {
      await interaction.reply({
        content: 'Button not found',
        ephemeral: true,
      });
      return;
    }

    await button.Execute(interaction);
  }
}