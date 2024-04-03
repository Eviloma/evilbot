import type { Collection } from 'discord.js';
import type DiscordOauth2 from 'discord-oauth2';
import type { Kazagumo } from 'kazagumo';

import type Button from '@/classes/Button';
import type Command from '@/classes/Command';
import type SubCommand from '@/classes/SubCommand';

export default interface IClient {
  commands: Collection<string, Command>;
  buttons: Collection<string, Button>;
  subCommands: Collection<string, SubCommand>;
  cooldowns: Collection<string, Collection<string, number>>;
  lavalink: Kazagumo;
  oauth: DiscordOauth2;

  Init(): void;
  LoadHandlers(): void;
  UpdateSettings(): Promise<void>;
  GetSetting(key: string): string | undefined;
}
