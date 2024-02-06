import path from 'node:path';

import { glob } from 'glob';
import { forEach, map, noop, split } from 'lodash';

import IHandler from '../interfaces/IHandler';
import env from '../libs/env';
import logger from '../libs/logger';
import MusicControllerUpdate from '../libs/music-controller-update';
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

      logger.info(`Loaded event ${event.name.toString()}`);

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

  async LoadLavalinkEvents() {
    this.client.lavalink.shoukaku.on('close', (name, code, reason) => {
      logger.info(`Lavalink ${name} is closed.\nCode: ${code}\nReason: ${reason}\n`);
    });

    this.client.lavalink.shoukaku.on('debug', (name, info) => {
      if (env.isDev) {
        logger.info(`Lavalink ${name}\ndebug: ${info}\n`);
      }
    });

    this.client.lavalink.shoukaku.on('disconnect', (name, count) => {
      logger.info(`Lavalink ${name} is disconnected.\nCount: ${count}\n`);
    });

    this.client.lavalink.shoukaku.on('raw', (name, json) => {
      logger.info(`Lavalink ${name}\nraw: ${JSON.stringify(json)}\n`);
    });

    this.client.lavalink.shoukaku.on('ready', (name, reconnected) => {
      logger.info(`Lavalink ${name} is ready.\nReconnected: ${reconnected}\n`);
    });

    this.client.lavalink.shoukaku.on('reconnecting', (name, reconnectsLeft, reconnectInterval) => {
      logger.info(
        `Lavalink ${name} is reconnecting.\nReconnects left: ${reconnectsLeft}\nReconnect interval: ${reconnectInterval}\n`
      );
    });

    this.client.lavalink.shoukaku.on('error', (name, error) => {
      logger.error(`Lavalink ${name}\nerror: ${error.message}\n`);
    });

    this.client.lavalink.on('playerStart', (player, track) => {
      MusicControllerUpdate(this.client, player, track);
    });

    this.client.lavalink.on('playerEnd', (player) => {
      player.data.get('message')?.delete().catch(noop);
    });

    this.client.lavalink.on('playerEmpty', (player) => {
      player.data.get('message')?.delete().catch(noop);
      setTimeout(() => {
        if (!player.playing) {
          player.destroy();
        }
      }, 15_000);
    });

    this.client.lavalink.on('playerDestroy', (player) => {
      player.data.get('message')?.delete().catch(noop);
    });
  }
}
