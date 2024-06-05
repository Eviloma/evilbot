import type { Collection } from "discord.js";

import type Button from "@/classes/Button";
import type Command from "@/classes/Command";
import type SubCommand from "@/classes/SubCommand";
import type { Poru } from "poru";

export default interface IClient {
  commands: Collection<string, Command>;
  buttons: Collection<string, Button>;
  subCommands: Collection<string, SubCommand>;
  cooldowns: Collection<string, Collection<string, number>>;
  lavalink: Poru;

  Init(): void;
  LoadHandlers(): void;
  UpdateSettings(): Promise<void>;
  GetSetting(key: string): string | undefined;
}
