import { DefaultButtonError, MusicQueueIsEmpty } from "@/classes/CustomError";
import type { Button } from "@/types/Button";
import { getDefaultEmbed } from "@/utils/discord-embeds";
import { RainlinkLoopMode } from "rainlink";

const button: Button = {
  id: "music-loop",
  async execute(i) {
    const { guild, client } = i;
    if (!guild) throw DefaultButtonError;

    const player = client.lavalink?.players.get(guild.id);
    if (!player) throw MusicQueueIsEmpty;

    const loopStatus = player.loop;

    const embed = getDefaultEmbed(client).setTitle("Music");

    switch (loopStatus) {
      case RainlinkLoopMode.NONE:
        player.setLoop(RainlinkLoopMode.SONG);
        embed.setDescription("🔁 Changed loop mode to Track");
        break;
      case RainlinkLoopMode.SONG:
        player.setLoop(RainlinkLoopMode.QUEUE);
        embed.setDescription("🔁 Changed loop mode to Queue");
        break;
      case RainlinkLoopMode.QUEUE:
        player.setLoop(RainlinkLoopMode.NONE);
        embed.setDescription("🔁 Changed loop mode to None");
        break;
    }

    await client.updateMusicController(player);
    await i.reply({ embeds: [embed], ephemeral: true });
  },
};

export default button;
