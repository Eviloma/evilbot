import {
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
import type { Player } from "poru";

export default class Stop extends MusicCommand {
  constructor(client: Client) {
    super(client, {
      name: "stop",
      description: "Stop the music",
      category: Category.Music,
      options: [],
      default_member_permissions: PermissionsBitField.Flags.UseApplicationCommands,
      dm_permission: false,
    });
  }

  async MusicCommandExecute(interaction: ChatInputCommandInteraction) {
    const guild = interaction.guild as Guild;
    const member = interaction.member as GuildMember;
    const channel = interaction.channel as GuildTextBasedChannel;
    const bot = guild.members.me as GuildMember;

    const musicChannelId = this.client.GetSetting("music_channel_id");

    await this.NullCheck(interaction);
    await this.MusicChannelCheck(channel.id, musicChannelId);
    await this.UserVoiceChannelCheck(member, bot);
    const player = this.client.lavalink.players.get(guild.id) as Player;

    await this.ClearQueueCheck(player);

    await player.destroy();

    const embed = DefaultEmbed(this.client).setTitle(EmbedTitles.music).setDescription("⏹️ Відтворення зупинено");
    interaction.reply({ embeds: [embed] });
  }
}
