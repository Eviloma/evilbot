import Discord, { Collection } from 'discord.js';
import { Connectors, Shoukaku } from 'shoukaku';

import IClient from '../interfaces/IClient';
import env from '../libs/env';
import logger from '../libs/logger';
import PublicLavalink from '../public-lavalink.json';
import Command from './Command';
import Handler from './Handler';
import SubCommand from './SubCommand';

export default class Client extends Discord.Client implements IClient {
  handlers: Handler;

  commands: Collection<string, Command>;

  subCommands: Collection<string, SubCommand>;

  cooldowns: Collection<string, Collection<string, number>>;

  lavalink: Shoukaku;

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
    this.lavalink = new Shoukaku(new Connectors.DiscordJS(this), [...PublicLavalink.nodes], {
      resume: true,
      resumeTimeout: 30_000,
      resumeByLibrary: true,
      reconnectTries: 5,
      reconnectInterval: 5000,
      restTimeout: 30_000,
      moveOnDisconnect: true,
      voiceConnectionTimeout: 30_000,
    });
  }

  Init(): void {
    this.LoadHandlers();
    this.login(env.BOT_TOKEN).catch((error) => logger.error(error));
  }

  LoadHandlers(): void {
    this.handlers.LoadEvents();
    this.handlers.LoadCommands();
    this.handlers.LoadLavalinkEvents();
  }
}
