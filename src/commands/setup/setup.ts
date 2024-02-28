import { ApplicationCommandOptionType, PermissionsBitField } from 'discord.js';

import Client from '../../classes/Client';
import Command from '../../classes/Command';
import Category from '../../enums/Category';

export default class Setup extends Command {
  constructor(client: Client) {
    super(client, {
      name: 'setup',
      description: 'Setup bot',
      category: Category.Setup,
      options: [
        {
          name: 'temp-voice',
          description: 'Setup temp voice channels module',
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: 'join-to-talk-channel',
              description: 'Join to talk channel. Must be a voice channel',
              type: ApplicationCommandOptionType.Channel,
              required: true,
            },
            {
              name: 'temp-voice-channels-category',
              description: 'Temp voice channels category. Must be a category',
              type: ApplicationCommandOptionType.Channel,
              required: true,
            },
          ],
        },
      ],
      default_member_permissions: PermissionsBitField.Flags.Administrator,
      dm_permission: false,
    });
  }
}
