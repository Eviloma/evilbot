import Discord, { Collection } from 'discord.js';

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
