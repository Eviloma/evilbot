import { Glob } from 'bun';
import { Table } from 'console-table-printer';
import { map, noop, split } from 'lodash';

import type IHandler from '@/interfaces/IHandler';
import env from '@/utils/env';
import logger from '@/utils/logger';
import MusicControllerUpdate from '@/utils/music-controller-update';

import type Button from './Button';
import type Client from './Client';
import type Command from './Command';
import type Event from './Event';

const glob = new Glob('**/*.ts');

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

    await Promise.all(
      map([...glob.scanSync('src/events/')], async (file) => {
        const path = Bun.resolveSync(`src/events/${file}`, '.');
        const event: Event = await import(path)
          .then((module) => new module.default(this.client))
          .catch((error) => logger.error(error));
        if (!event.name) {
          return (
            delete require.cache[require.resolve(path)] &&
            p.addRow({ name: path, status: '⚠️ Event name not found', once: 'N/A' })
          );
        }
        const execute = async (...arguments_: unknown[]) => event.Execute(...arguments_);
        if (event.once) {
          this.client.once(event.name.toString(), execute);
        } else {
          this.client.on(event.name.toString(), execute);
        }
        return (
          delete require.cache[require.resolve(path)] && p.addRow({ name: path, status: '✅ Loaded', once: event.once })
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

    await Promise.all(
      map([...glob.scanSync('src/commands/')], async (file) => {
        const path = Bun.resolveSync(`src/commands/${file}`, '.');
        const command: Command = await import(path)
          .then((module) => new module.default(this.client))
          .catch((error) => logger.error(error));

        if (!command.name) {
          return (
            delete require.cache[require.resolve(path)] &&
            p.addRow({ name: path, status: '⚠️ Command name not found', once: 'N/A' })
          );
        }

        if (split(command.name, '.')[1]) {
          return (
            this.client.subCommands.set(command.name, command) &&
            p.addRow({ name: command.name, status: '✅', type: 'Subcommand', category: 'N/A' })
          );
        }

        this.client.commands.set(command.name, command);
        p.addRow({ name: command.name, status: '✅', type: 'Command', category: (command as Command).category });

        return delete require.cache[require.resolve(path)];
      })
    );

    p.printTable();
  }

  async LoadButtons() {
    await Promise.all(
      map([...glob.scanSync('src/buttons/')], async (file) => {
        const path = Bun.resolveSync(`src/buttons/${file}`, '.');
        const button: Button = await import(path)
          .then((module) => new module.default(this.client))
          .catch((error) => logger.error(error));
        if (!button.id) {
          return delete require.cache[require.resolve(path)] && logger.error(`Missing button id in ${path}`);
        }
        this.client.buttons.set(button.id, button);
        return delete require.cache[require.resolve(path)];
      })
    );
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
