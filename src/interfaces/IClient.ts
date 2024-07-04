import type { Collection, Message } from "discord.js";

import type Button from "@/classes/Button";
import type Command from "@/classes/Command";
import type SubCommand from "@/classes/SubCommand";
import type { Player, Poru, Track } from "poru";

export default interface IClient {
  commands: Collection<string, Command>;
  buttons: Collection<string, Button>;
  subCommands: Collection<string, SubCommand>;
  cooldowns: Collection<string, Collection<string, number>>;
  lavalink: Poru;
  musicMessage: Message | null | undefined;

  Init(): void;
  LoadHandlers(): void;
  UpdateSettings(): Promise<void>;
  GetSetting(key: string): string | undefined;
  MusicControllerUpdate(player: Player, track: Track | null): void;
}
