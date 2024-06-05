import {
  ApplicationCommandOptionType,
  type ChatInputCommandInteraction,
  type Guild,
  type GuildMember,
  type GuildTextBasedChannel,
  PermissionsBitField,
} from "discord.js";

import type Client from "@/classes/Client";
import MusicCommand from "@/classes/commands/Music";
import Category from "@/enums/Category";
import DefaultEmbed from "@/utils/discord-embeds";
import EmbedTitles from "@/utils/embed-titles";
import MusicControllerUpdate from "@/utils/music-controller-update";
import type { Player } from "poru";

export default class Loop extends MusicCommand {
  constructor(client: Client) {
    super(client, {
      name: "loop",
      description: "Set loop status",
      category: Category.Music,
      options: [
        {
          name: "status",
          description: "Set loop status",
          type: ApplicationCommandOptionType.String,
          choices: [
            {
              name: "Off",
              value: "NONE",
            },
            {
              name: "Queue",
              value: "QUEUE",
            },
            {
              name: "One track",
              value: "TRACK",
            },
          ],
          required: true,
        },
      ],
      default_member_permissions: PermissionsBitField.Flags.UseApplicationCommands,
      dm_permission: false,
    });
  }

  async MusicCommandExecute(interaction: ChatInputCommandInteraction) {
    const guild = interaction.guild as Guild;
    const member = interaction.member as GuildMember;
    const channel = interaction.channel as GuildTextBasedChannel;
    const bot = guild.members.me as GuildMember;

    const loopStatus = interaction.options.getString("status", true) as "NONE" | "QUEUE" | "TRACK";

    const musicChannelId = this.client.GetSetting("music_channel_id");

    await this.NullCheck(interaction);
    await this.MusicChannelCheck(channel.id, musicChannelId);
    await this.UserVoiceChannelCheck(member, bot);

    await interaction.deferReply({ ephemeral: true });
    const player = this.client.lavalink.players.get(guild.id) as Player;

    await this.ClearQueueCheck(player);
    player.setLoop(loopStatus);
    await MusicControllerUpdate(this.client, player);

    const embed = DefaultEmbed(this.client).setTitle(EmbedTitles.music);

    switch (loopStatus) {
      case "NONE": {
        embed.setDescription("🔁 Повтор вимкнено");
        break;
      }
      case "QUEUE": {
        embed.setDescription("🔁 Змінено на повтор списка відтвороення");
        break;
      }
      case "TRACK": {
        embed.setDescription("🔁 Змінено на повтор однієї пісні");
        break;
      }
      default: {
        break;
      }
    }
    interaction.editReply({ embeds: [embed] });
  }
}
