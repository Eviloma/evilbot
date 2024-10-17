import type { Button } from "@/types/Button";
import "discord.js";
import type { Rainlink, RainlinkPlayer, RainlinkTrack } from "rainlink";

declare module "discord.js" {
  interface Client {
    lavalink?: Rainlink;
    buttons: Collection<string, Button>;
    updateMusicController: (player: RainlinkPlayer) => Promise<void>;
    musicMessage?: Message | null;
    nowPlaying?: RainlinkTrack;
  }
}
