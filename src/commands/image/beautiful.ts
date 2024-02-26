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

export default class Beautiful extends Command {
  constructor(client: Client) {
    super(client, {
      name: 'beautiful',
      description: 'Create beautiful filter image. Priority: File -> User -> You',
      category: Category.Fun,
      options: [
        {
          name: 'user',
          description: 'The user',
          type: ApplicationCommandOptionType.User,
          required: false,
        },
        {
          name: 'image',
          description: 'The image file',
          type: ApplicationCommandOptionType.Attachment,
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
    const attachImage = interaction.options.getAttachment('image');

    const image = await getImageByUrl(
      attachImage?.url ?? user?.displayAvatarURL({ size: 512 }) ?? member?.displayAvatarURL({ size: 512 })
    );

    if (!image) {
      interaction.reply({
        embeds: [ErrorEmbed(this.client, EmbedTitles.fun, 'Ви не маєте аватара')],
        ephemeral: true,
      });
      return;
    }

    const filteredImage = await canvacord.beautiful(image);
    interaction.reply({ files: [filteredImage] });
  }
}
