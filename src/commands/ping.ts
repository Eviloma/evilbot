import path from 'node:path';

import { Font } from 'canvacord';
import { ChatInputCommandInteraction, PermissionsBitField } from 'discord.js';

import GreetingsCard from '../canvas/GreetingsCard';
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

  async Execute(interaction: ChatInputCommandInteraction) {
    const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true, ephemeral: true });

    await Font.fromFile(path.join(__dirname, '../Raleway.ttf'));

    const card = new GreetingsCard()
      .setAvatar(interaction.user.displayAvatarURL({ forceStatic: true }))
      .setDisplayName(interaction.user.username)
      .setType('welcome')
      .setMessage(`Вітаємо на сервері ${interaction.guild?.name}!`);

    const image = await card.build();

    interaction.editReply({
      content: `Roundtrip latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms`,
      files: [image],
    });
  }
}
