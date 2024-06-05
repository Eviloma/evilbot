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
import DefaultEmbed, { WarningEmbed } from "@/utils/discord-embeds";
import EmbedTitles from "@/utils/embed-titles";
import { forEach } from "lodash";

export default class Play extends MusicCommand {
  constructor(client: Client) {
    super(client, {
      name: "play",
      description: "Play a song!",
      category: Category.Music,
      options: [
        {
          name: "track",
          description: "The track to play",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
      default_member_permissions: PermissionsBitField.Flags.UseApplicationCommands,
      dm_permission: false,
      cooldown: 10,
    });
  }

  async MusicCommandExecute(interaction: ChatInputCommandInteraction) {
    const guild = interaction.guild as Guild;
    const member = interaction.member as GuildMember;
    const channel = interaction.channel as GuildTextBasedChannel;
    const bot = guild.members.me as GuildMember;

    const track = interaction.options.getString("track", true);

    const musicChannelId = this.client.GetSetting("music_channel_id");

    await interaction.deferReply({ ephemeral: true });

    await this.NullCheck(interaction);
    await this.MusicChannelCheck(channel.id, musicChannelId);
    await this.UserVoiceChannelCheck(member, bot);

    const player =
      this.client.lavalink.players.get(guild.id) ??
      this.client.lavalink.createConnection({
        guildId: guild.id,
        // biome-ignore lint/style/noNonNullAssertion: Checked in MusicChannelCheck
        textChannel: musicChannelId!,
        // biome-ignore lint/style/noNonNullAssertion: Checked in UserVoiceChannelCheck
        voiceChannel: member.voice.channelId!,
      });

    const result = await player.resolve({ query: track, requester: member });

    if (result.tracks.length === 0) {
      await interaction.editReply({
        embeds: [WarningEmbed(this.client, EmbedTitles.music, "Трек не знайдено")],
      });
      return;
    }

    forEach(result.tracks, (track) => {
      player.queue.add(track);
    });

    if (!player.isPlaying) {
      await player.play();
    }

    const embed = DefaultEmbed(this.client).setTitle(EmbedTitles.music);
    embed.setDescription(
      result.loadType === "playlist"
        ? `🎶 Додано ${result.tracks.length} публікації з ${result.playlistInfo.name}`
        : `🎶 Додано ${result.tracks[0].info.title}`,
    );
    await interaction.editReply({ embeds: [embed] });
  }
}
