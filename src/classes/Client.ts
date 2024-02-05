import Discord, { Collection } from 'discord.js';
import { LavalinkManager } from 'lavalink-client';

import IClient from '../interfaces/IClient';
import env from '../libs/env';
import logger from '../libs/logger';
import Command from './Command';
import Handler from './Handler';
import SubCommand from './SubCommand';

export default class Client extends Discord.Client implements IClient {
  handlers: Handler;

  commands: Collection<string, Command>;

  subCommands: Collection<string, SubCommand>;

  cooldowns: Collection<string, Collection<string, number>>;

  lavalink: LavalinkManager;

  constructor() {
    super({
      intents: [
        'GuildMembers',
        'GuildMessageReactions',
        'GuildMessageTyping',
        'GuildMessages',
        'MessageContent',
        'Guilds',
        'GuildVoiceStates',
      ],
    });

    this.handlers = new Handler(this);
    this.commands = new Collection();
    this.subCommands = new Collection();
    this.cooldowns = new Collection();
    this.lavalink = new LavalinkManager({
      nodes: [],
      sendToShard: (guildId, payload) => this.guilds.cache.get(guildId)?.shard?.send(payload),
      client: {
        id: env.CLIENT_ID,
        username: 'EvilBot',
      },
      autoSkip: true,
      playerOptions: {
        clientBasedPositionUpdateInterval: 150,
        defaultSearchPlatform: 'ytsearch',
        volumeDecrementer: 0.5,
        onDisconnect: {
          autoReconnect: true,
          destroyPlayer: false,
        },
        onEmptyQueue: {
          destroyAfterMs: 30_000,
        },
      },
      queueOptions: {
        maxPreviousTracks: 25,
      },
    });
  }

  Init(): void {
    this.LoadHandlers();
    this.login(env.BOT_TOKEN).catch((error) => logger.error(error));
  }

  LoadHandlers(): void {
    this.handlers.LoadEvents();
    this.handlers.LoadCommands();
  }
}
