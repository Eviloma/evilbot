import Discord, { Collection } from "discord.js";
import { find } from "lodash";

import db from "@/db";
import { type SettingKeys, type Settings, settingsSchema } from "@/db/schema";
import type IClient from "@/interfaces/IClient";
import env from "@/utils/env";
import logger from "@/utils/logger";

import { Spotify } from "node_modules/poru-spotify/dist/Spotify";
import { Poru } from "poru";
import type Button from "./Button";
import type Command from "./Command";
import Handler from "./Handler";
import type SubCommand from "./SubCommand";

export default class Client extends Discord.Client implements IClient {
  handlers: Handler;

  commands: Collection<string, Command>;

  buttons: Collection<string, Button>;

  subCommands: Collection<string, SubCommand>;

  cooldowns: Collection<string, Collection<string, number>>;

  lavalink: Poru;

  settings: Settings[];

  constructor() {
    super({
      intents: [
        "GuildMembers",
        "GuildMessageReactions",
        "GuildMessageTyping",
        "GuildMessages",
        "MessageContent",
        "Guilds",
        "GuildVoiceStates",
      ],
    });

    this.settings = [];
    this.handlers = new Handler(this);
    this.commands = new Collection();
    this.buttons = new Collection();
    this.subCommands = new Collection();
    this.cooldowns = new Collection();
    this.lavalink = new Poru(
      this,
      [
        {
          name: env.LAVALINK_NAME,
          host: env.LAVALINK_HOST,
          port: env.LAVALINK_PORT,
          password: env.LAVALINK_PASSWORD,
          secure: env.LAVALINK_SECURED === "true",
        },
      ],
      {
        library: "discord.js",
        defaultPlatform: "ytsearch",
        plugins: [
          new Spotify({
            clientID: env.SPOTIFY_CLIENT_ID,
            clientSecret: env.SPOTIFY_CLIENT_SECRET,
          }),
        ],
      },
    );
  }

  async Init() {
    await this.LoadHandlers();
    await this.login(env.BOT_TOKEN).catch((error) => logger.error(error));
    await this.lavalink.init();
  }

  async LoadHandlers() {
    await this.handlers.LoadEvents();
    await this.handlers.LoadCommands();
    await this.handlers.LoadButtons();
    await this.handlers.LoadLavalinkEvents();
  }

  async UpdateSettings() {
    this.settings = await db.select().from(settingsSchema);
  }

  GetSetting(key: SettingKeys) {
    return find(this.settings, ["key", key])?.value;
  }
}
