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
    logger.info(`⏳ Starting...`);
    logger.info(`⏳ Setting Presence...`);
    this.client.user?.setPresence({
      activities: [
        { name: 'customstatus', type: ActivityType.Custom, state: `Evilbot v${process.env.npm_package_version}` },
      ],
      status: 'online',
    });
    logger.info(`✅ Client ${this.client.user?.tag} is ready`);

    logger.info(`⏳ Loading settings from database...`);
    await this.client
      .UpdateSettings()
      .then(() => logger.info('✅ Database settings loaded'))
      .catch((error) => logger.error(`❌ Error while loading settings: ${error}`));

    if (env.DISABLE_UPDATE_COMMANDS) {
      logger.warn('⚠️ Update commands is disabled');
      return;
    }

    logger.info('⏳ Updating commands...');

    const commands = this.GetJson(this.client.commands);

    const rest = new REST({ globalRequestsPerSecond: 10, invalidRequestWarningInterval: 1 }).setToken(env.BOT_TOKEN);

    await rest
      .put(Routes.applicationCommands(env.CLIENT_ID), {
        body: commands,
      })
      .then((data) => logger.info(`✅ Successfully set ${(data as { length: number }).length} commands`))
      .catch((error) => logger.error(`❌ Failed to set ${(error as { length: number }).length} commands`));
  }

  private GetJson(commands: Collection<string, Command>) {
    return commands.map((command) => ({
      name: command.name,
      description: command.description,
      options: command.options,
      default_member_permissions: command.default_member_permissions.toString(),
      dm_permission: command.dm_permission,
    }));
  }
}
