import { Collection } from 'discord.js';
import { Kazagumo } from 'kazagumo';

import Command from '../classes/Command';
import SubCommand from '../classes/SubCommand';

export default interface IClient {
  commands: Collection<string, Command>;
  subCommands: Collection<string, SubCommand>;
  cooldowns: Collection<string, Collection<string, number>>;
  lavalink: Kazagumo;

  Init(): void;
  LoadHandlers(): void;
}
