import { ActivityType, Collection, Events, REST, Routes } from 'discord.js';

import Client from '../../classes/Client';
import Command from '../../classes/Command';
import Event from '../../classes/Event';
import env from '../../libs/env';
import logger from '../../libs/logger';

export default class Ready extends Event {
  constructor(client: Client) {
    super(client, {
      name: Events.ClientReady,
      description: 'Client is ready',
      once: true,
    });
  }

  async Execute() {
    logger.info(`Client ${this.client.user?.tag} is ready`);

    this.client.user?.setPresence({
      activities: [{ name: 'Evilbot v4.0.0', type: ActivityType.Streaming, url: 'https://twitch.tv/higherror' }],
      status: 'online',
    });

    const commands = this.GetJson(this.client.commands);

    const rest = new REST({ version: '10' }).setToken(env.BOT_TOKEN);

    // clear all commands
    await rest.put(Routes.applicationCommands(env.CLIENT_ID), { body: [] });

    // add commands
    const setCommands = (await rest
      .put(Routes.applicationCommands(env.CLIENT_ID), {
        body: commands,
      })
      .catch((error) => logger.error(error))) as { length: number };

    logger.info(`Successfully set ${setCommands.length} commands`);
  }

  private GetJson(commands: Collection<string, Command>) {
    // Lodash can't iterate over Collection
    // eslint-disable-next-line lodash/prefer-lodash-method
    return commands.map((command) => ({
      name: command.name,
      description: command.description,
      options: command.options,
      default_member_permissions: command.default_member_permissions.toString(),
      dm_permission: command.dm_permission,
    }));
  }
}
