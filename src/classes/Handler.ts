import path from 'node:path';

import { glob } from 'glob';
import { forEach, map, split } from 'lodash';

import IHandler from '../interfaces/IHandler';
import logger from '../libs/logger';
import Client from './Client';
import Command from './Command';
import Event from './Event';

export default class Handler implements IHandler {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  async LoadEvents() {
    const files = await glob(`dist/events/**/*.js`)
      .then((filePath) => map(filePath, (file) => path.resolve(file)))
      .catch((error) => {
        logger.error(error);
        return [];
      });

    forEach(files, async (file) => {
      const event: Event = await import(file)
        .then((module) => new module.default(this.client))
        .catch((error) => logger.error(error));

      if (!event.name) {
        return delete require.cache[require.resolve(file)] && logger.error(`Missing event name in ${file}`);
      }

      const execute = async (...args: unknown[]) => event.Execute(...args);

      if (event.once) {
        this.client.once(event.name.toString(), execute);
      } else {
        this.client.on(event.name.toString(), execute);
      }

      return delete require.cache[require.resolve(file)];
    });
  }

  async LoadCommands() {
    const files = await glob(`dist/commands/**/*.js`)
      .then((filePath) => map(filePath, (file) => path.resolve(file)))
      .catch((error) => {
        logger.error(error);
        return [];
      });

    forEach(files, async (file) => {
      const command: Command = await import(file)
        .then((module) => new module.default(this.client))
        .catch((error) => logger.error(error));

      if (!command.name) {
        return delete require.cache[require.resolve(file)] && logger.error(`Missing event name in ${file}`);
      }

      if (split(split(file, '/').pop(), '.')[2]) return this.client.subCommands.set(command.name, command);

      this.client.commands.set(command.name, command);

      return delete require.cache[require.resolve(file)];
    });
  }
}
