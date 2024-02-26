import { canvacord } from 'canvacord';
import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  GuildMember,
  PermissionsBitField,
} from 'discord.js';
import { constant } from 'lodash';

import Client from '../../classes/Client';
import Command from '../../classes/Command';
import Category from '../../enums/Category';
import { getImageByUrl } from '../../libs/axios';
import { ErrorEmbed } from '../../libs/discord-embeds';
import EmbedTitles from '../../libs/embed-titles';

export default class Trash extends Command {
  constructor(client: Client) {
    super(client, {
      name: 'trash',
      description: 'Create trash filter image',
      category: Category.Fun,
      options: [
        {
          name: 'user',
          description: 'Select a user to take their avatar for the filter (ignored when using a file)',
          type: ApplicationCommandOptionType.User,
          required: false,
        },
      ],
      default_member_permissions: PermissionsBitField.Flags.UseApplicationCommands,
      dm_permission: true,
    });
  }

  async Execute(interaction: ChatInputCommandInteraction) {
    const member = interaction.member as GuildMember | null;
    const user = interaction.options.getMember('user') as GuildMember | null;

    const image = await getImageByUrl(user?.displayAvatarURL({ size: 512 }) ?? member?.displayAvatarURL({ size: 512 }));
    if (!image) {
      interaction.reply({
        embeds: [ErrorEmbed(this.client, EmbedTitles.fun, 'Не вдалось отримати зображення для обробки')],
        ephemeral: true,
      });
      return;
    }

    const filteredImage = await canvacord.trash(image).catch(constant(null));
    if (!filteredImage) {
      interaction.reply({
        embeds: [ErrorEmbed(this.client, EmbedTitles.fun, 'Не вдалось обробити зображення')],
        ephemeral: true,
      });
      return;
    }
    interaction.reply({ files: [filteredImage] });
  }
}
