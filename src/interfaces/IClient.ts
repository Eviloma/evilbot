import { Collection } from 'discord.js';
import { Shoukaku } from 'shoukaku';

import Command from '../classes/Command';
import SubCommand from '../classes/SubCommand';

export default interface IClient {
  commands: Collection<string, Command>;
  subCommands: Collection<string, SubCommand>;
  cooldowns: Collection<string, Collection<string, number>>;
  lavalink: Shoukaku;

  Init(): void;
  LoadHandlers(): void;
}
