import { canvacord } from 'canvacord';
import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  GuildMember,
  PermissionsBitField,
} from 'discord.js';

import Client from '../../classes/Client';
import Command from '../../classes/Command';
import Category from '../../enums/Category';
import { getImageByUrl } from '../../libs/axios';
import { ErrorEmbed } from '../../libs/discord-embeds';
import EmbedTitles from '../../libs/embed-titles';

export default class Hitler extends Command {
  constructor(client: Client) {
    super(client, {
      name: 'hitler',
      description: 'Create hitler (worst then hitler) filter image',
      category: Category.Fun,
      options: [
        {
          name: 'user',
          description: 'The user',
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
        embeds: [ErrorEmbed(this.client, EmbedTitles.fun, 'Ви не маєте аватара')],
        ephemeral: true,
      });
      return;
    }

    const filteredImage = await canvacord.hitler(image);
    interaction.reply({ files: [filteredImage] });
  }
}
