import path from 'node:path';

import { Table } from 'console-table-printer';
import { glob } from 'glob';
import { forEach, map, noop, split } from 'lodash';

import IHandler from '../interfaces/IHandler';
import env from '../libs/env';
import logger from '../libs/logger';
import MusicControllerUpdate from '../libs/music-controller-update';
import Button from './Button';
import Client from './Client';
import Command from './Command';
import Event from './Event';
import SubCommand from './SubCommand';

export default class Handler implements IHandler {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  async LoadEvents() {
    const p = new Table({
      columns: [
        { name: 'name', title: 'Name / Path' },
        { name: 'once', title: 'Once' },
        { name: 'status', title: 'Status' },
      ],
      sort: (row1, row2) => row1.name.localeCompare(row2.name),
    });

    const files = await glob(`dist/events/**/*.js`)
      .then((filePath) => map(filePath, (file) => path.resolve(file)))
      .catch((error) => {
        logger.error(error);
        return [];
      });

    await Promise.all(
      map(files, async (file) => {
        const event: Event = await import(file)
          .then((module) => new module.default(this.client))
          .catch((error) => logger.error(error));

        if (!event.name) {
          return (
            delete require.cache[require.resolve(file)] &&
            p.addRow({ name: file, status: "⚠️ Can't find event name", once: 'N/A' })
          );
        }

        const execute = async (...args: unknown[]) => event.Execute(...args);

        if (event.once) {
          this.client.once(event.name.toString(), execute);
        } else {
          this.client.on(event.name.toString(), execute);
        }

        return (
          delete require.cache[require.resolve(file)] &&
          p.addRow({ name: event.name.toString(), status: '✅ Loaded', once: event.once })
        );
      })
    );

    p.printTable();
  }

  async LoadCommands() {
    const p = new Table({
      columns: [
        { name: 'name', title: 'Name / Path' },
        { name: 'type', title: 'Type' },
        { name: 'category', title: 'Category' },
        { name: 'status', title: 'Status' },
      ],
      sort: (row1, row2) => row1.name.localeCompare(row2.name),
    });
    const files = await glob(`dist/commands/**/*.js`)
      .then((filePath) => map(filePath, (file) => path.resolve(file)))
      .catch((error) => {
        logger.error(error);
        return [];
      });

    await Promise.all(
      map(files, async (file) => {
        const command: Command | SubCommand = await import(file)
          .then((module) => new module.default(this.client))
          .catch((error) => logger.error(error));

        if (!command.name) {
          return (
            delete require.cache[require.resolve(file)] &&
            p.addRow({ name: file, status: "⚠️ Can't find command name", type: 'N/A' })
          );
        }

        if (split(command.name, '.')[1]) {
          return (
            this.client.subCommands.set(command.name, command) &&
            p.addRow({ name: command.name, status: '✅', type: 'Subcommand', category: 'N/A' })
          );
        }

        this.client.commands.set(command.name, command as Command);
        p.addRow({ name: command.name, status: '✅', type: 'Command', category: (command as Command).category });

        return delete require.cache[require.resolve(file)];
      })
    );

    p.printTable();
  }

  async LoadButtons() {
    const files = await glob(`dist/buttons/**/*.js`)
      .then((filePath) => map(filePath, (file) => path.resolve(file)))
      .catch((error) => {
        logger.error(error);
        return [];
      });

    forEach(files, async (file) => {
      const button: Button = await import(file)
        .then((module) => new module.default(this.client))
        .catch((error) => logger.error(error));

      if (!button.id) {
        return delete require.cache[require.resolve(file)] && logger.error(`Missing button id in ${file}`);
      }

      this.client.buttons.set(button.id, button);

      return delete require.cache[require.resolve(file)];
    });
  }

  async LoadLavalinkEvents() {
    this.client.lavalink.shoukaku.on('close', (name, code, reason) => {
      logger.info(`${name} is closed. Code: ${code}. Reason: ${reason}`);
    });

    this.client.lavalink.shoukaku.on('debug', (name, info) => {
      if (env.isDev) {
        logger.info(`Debug ${name}: ${info}`);
      }
    });

    this.client.lavalink.shoukaku.on('disconnect', (name) => {
      logger.info(`${name} is disconnected.`);
    });

    this.client.lavalink.shoukaku.on('raw', (name, json) => {
      if (env.isDev) {
        logger.info(`Raw ${name}: ${JSON.stringify(json)}`);
      }
    });

    this.client.lavalink.shoukaku.on('ready', (name) => {
      logger.info(`${name} is ready.`);
    });

    this.client.lavalink.shoukaku.on('reconnecting', (name, reconnectsLeft) => {
      logger.info(`${name} is reconnecting... Reconnects left: ${reconnectsLeft}.`);
    });

    this.client.lavalink.shoukaku.on('error', (name, error) => {
      logger.error(`${name}. Error: ${error.message}`);
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
          player.destroy().catch(noop);
        }
      }, 15_000);
    });

    this.client.lavalink.on('playerDestroy', (player) => {
      player.data.get('message')?.delete().catch(noop);
    });
  }
}
