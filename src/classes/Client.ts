import Discord, { Collection } from 'discord.js';
import { Kazagumo } from 'kazagumo';
import Spotify from 'kazagumo-spotify';
import { Connectors } from 'shoukaku';

import IClient from '../interfaces/IClient';
import env from '../libs/env';
import LavalinkServers from '../libs/lavalink-servers';
import logger from '../libs/logger';
import Button from './Button';
import Command from './Command';
import Handler from './Handler';
import SubCommand from './SubCommand';

export default class Client extends Discord.Client implements IClient {
  handlers: Handler;

  commands: Collection<string, Command>;

  buttons: Collection<string, Button>;

  subCommands: Collection<string, SubCommand>;

  cooldowns: Collection<string, Collection<string, number>>;

  lavalink: Kazagumo;

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
    this.buttons = new Collection();
    this.subCommands = new Collection();
    this.cooldowns = new Collection();
    this.lavalink = new Kazagumo(
      {
        defaultSearchEngine: 'youtube',
        plugins: [
          new Spotify({
            clientId: env.SPOTIFY_CLIENT_ID,
            clientSecret: env.SPOTIFY_CLIENT_SECRET,
            playlistPageLimit: 1,
            albumPageLimit: 1,
            searchLimit: 10,
            searchMarket: 'UA',
          }),
        ],
        send: (guildId, payload) => {
          const guild = this.guilds.cache.get(guildId);
          if (guild) guild.shard.send(payload);
        },
      },
      new Connectors.DiscordJS(this),
      [...LavalinkServers()]
    );
  }

  async Init() {
    await this.LoadHandlers();

    this.rest.on('rateLimited', (info) => {
      console.log('rateLimited', info);
    });
    await this.login(env.BOT_TOKEN).catch((error) => logger.error(error));
  }

  async LoadHandlers() {
    await this.handlers.LoadEvents();
    await this.handlers.LoadCommands();
    await this.handlers.LoadButtons();
    await this.handlers.LoadLavalinkEvents();
  }
}
