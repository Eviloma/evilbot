import Discord, { Collection, type Message } from "discord.js";
import { find, noop } from "lodash";

import db from "@/db";
import { type SettingKeys, type Settings, settingsSchema } from "@/db/schema";
import type IClient from "@/interfaces/IClient";
import env from "@/utils/env";
import logger from "@/utils/logger";

import DefaultEmbed from "@/utils/discord-embeds";
import EmbedTitles from "@/utils/embed-titles";
import { musicControllRow } from "@/utils/rows";
import DiscordOauth2 from "discord-oauth2";
import { Spotify } from "node_modules/poru-spotify/dist/Spotify";
import { type Player, Poru, type Track } from "poru";
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

  musicMessage: Message | null | undefined;

  oauth: DiscordOauth2;

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

    this.oauth = new DiscordOauth2({
      version: "v10",
      clientId: env.CLIENT_ID,
      clientSecret: env.CLIENT_SECRET,
    });
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

  async MusicControllerUpdate(player: Player, track: Track | null) {
    this.musicMessage?.delete().catch(noop);

    if (!(track && player.isConnected)) return;

    const embed = DefaultEmbed(this)
      .setTitle(EmbedTitles.music)
      .setDescription(
        `**Зараз грає**: [${track.info.title}](${track.info.uri})\n**Автор**: ${track.info.author}\n\n **Ввімкнено за запитом**: ${track.info.requester}\n\n**Статус повтору**: ${player.loop === "NONE" ? "Вимкнено" : player.loop === "QUEUE" ? "Список відтворення" : "Один трек"}`,
      )
      .setImage(track.info.artworkUrl ?? null);

    const musicChannel = this.channels.cache.get(this.GetSetting("music_channel_id") ?? "");

    if (!musicChannel?.isTextBased()) return;

    await musicChannel
      .send({
        embeds: [embed],
        components: [musicControllRow],
      })
      .then((x) => {
        this.musicMessage = x;
      })
      .catch(noop);
  }
}
