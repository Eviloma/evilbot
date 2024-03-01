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
          name: 'show',
          description: 'Show all setup options',
          type: ApplicationCommandOptionType.Subcommand,
        },
        {
          name: 'music-channel',
          description: 'Setup music channel',
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: 'channel',
              description: 'Text channel for msuic module',
              type: ApplicationCommandOptionType.Channel,
              required: false,
            },
          ],
        },
        {
          name: 'global-channel',
          description: 'Setup global channel',
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: 'channel',
              description: 'Base text channel',
              type: ApplicationCommandOptionType.Channel,
              required: false,
            },
          ],
        },
        {
          name: 'join-role',
          description: 'Setup join role',
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: 'role',
              description: 'Role give to new members',
              type: ApplicationCommandOptionType.Role,
              required: false,
            },
          ],
        },
        {
          name: 'join-to-talk-channel',
          description: 'Setup join to talk channel',
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: 'channel',
              description: 'Voice channel for join to talk module',
              type: ApplicationCommandOptionType.Channel,
              required: false,
            },
          ],
        },

        {
          name: 'temp-voice-channels-category',
          description: 'Setup temp voice channels category',
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: 'category',
              description: 'Category for temp voice channels',
              type: ApplicationCommandOptionType.Channel,
              required: false,
            },
          ],
        },
      ],
      default_member_permissions: PermissionsBitField.Flags.Administrator,
      dm_permission: false,
    });
  }
}
