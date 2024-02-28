import { ImageSource } from 'canvacord';
import { ChatInputCommandInteraction, GuildMember, PermissionsBitField } from 'discord.js';
import { compact, constant, map } from 'lodash';

import Category from '../../enums/Category';
import IFunnyImageOptions from '../../interfaces/IFunnyImageOption';
import { getImageByUrl } from '../../libs/axios';
import { ErrorEmbed } from '../../libs/discord-embeds';
import EmbedTitles from '../../libs/embed-titles';
import Client from '../Client';
import Command from '../Command';

export default class FunnyImageCommand extends Command {
  minimalImages: number;

  func: (image: ImageSource[]) => Promise<Buffer | null>;

  constructor(client: Client, options: IFunnyImageOptions) {
    super(client, {
      name: options.name,
      description: options.description,
      category: Category.Fun,
      options: options.options,
      default_member_permissions: PermissionsBitField.Flags.UseApplicationCommands,
      dm_permission: true,
    });
    this.func = options.func;
    this.minimalImages = options.minimumImages;
  }

  async Execute(interaction: ChatInputCommandInteraction) {
    const member = interaction.member as GuildMember | null;

    if (!member) {
      interaction.reply({
        embeds: [ErrorEmbed(this.client, EmbedTitles.fun, 'Помилка обробки команди')],
        ephemeral: true,
      });
      return;
    }

    const users = compact(map(this.options, (e) => interaction.options.getMember(e.name) as GuildMember | null));
    const images = compact(await this.GetImages(users, member));

    if (images.length < this.minimalImages) {
      interaction.reply({
        embeds: [ErrorEmbed(this.client, EmbedTitles.fun, 'Не вдалось отримати зображення для обробки')],
        ephemeral: true,
      });
      return;
    }

    const filteredImage = await this.func(images).catch(constant(null));
    if (!filteredImage) {
      interaction.reply({
        embeds: [ErrorEmbed(this.client, EmbedTitles.fun, 'Не вдалось обробити зображення')],
        ephemeral: true,
      });
      return;
    }
    interaction.reply({ files: [filteredImage] });
  }

  async GetImages(users: GuildMember[], member: GuildMember) {
    if (this.minimalImages === 1) {
      return Promise.all([
        getImageByUrl(users[0]?.displayAvatarURL({ size: 512 }) ?? ''),
        getImageByUrl(member?.displayAvatarURL({ size: 512 }) ?? ''),
      ]);
    }
    if (this.minimalImages === 2 && users.length === 2) {
      return Promise.all([
        getImageByUrl(users[0]?.displayAvatarURL({ size: 512 }) ?? ''),
        getImageByUrl(users[1]?.displayAvatarURL({ size: 512 }) ?? ''),
      ]);
    }

    return Promise.all([
      getImageByUrl(member?.displayAvatarURL({ size: 512 }) ?? ''),
      getImageByUrl(users[0]?.displayAvatarURL({ size: 512 }) ?? ''),
    ]);
  }
}
