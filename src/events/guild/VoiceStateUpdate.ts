import {
  type CategoryChannel,
  ChannelType,
  type Collection,
  Events,
  type Guild,
  type GuildMember,
  PermissionFlagsBits,
  type VoiceBasedChannel,
  type VoiceChannel,
  type VoiceState,
} from "discord.js";
import { noop } from "lodash";

import type Client from "@/classes/Client";
import Event from "@/classes/Event";

export default class VoiceStateUpdate extends Event {
  constructor(client: Client) {
    super(client, {
      name: Events.VoiceStateUpdate,
      description: "VoiceStateUpdate",
      once: false,
    });
  }

  async Execute(oldState: VoiceState, newState: VoiceState) {
    const { member, guild } = oldState;
    const { channel: newChannel } = newState;

    const joinToTalkChannel = guild.channels.cache.get(this.client.GetSetting("join_to_talk_channel_id") ?? "");
    const parent = guild.channels.cache.get(this.client.GetSetting("temp_voice_channels_category_id") ?? "");

    if (!(guild && member && joinToTalkChannel && parent)) return;

    // If channel or parent not found or channel not voice channel or parent not category, return
    if (!(joinToTalkChannel && parent && joinToTalkChannel.isVoiceBased()) || parent.type !== ChannelType.GuildCategory)
      return;

    // If new channel is join to talk channel
    if (newChannel?.id === joinToTalkChannel.id) {
      await this.CreateTempVoiceChat(guild, member, joinToTalkChannel, parent);
    }

    await this.RemoveTempVoiceChat(guild, parent);
  }

  private async CreateTempVoiceChat(
    guild: Guild,
    member: GuildMember,
    joinToTalkChannel: VoiceBasedChannel,
    parent: CategoryChannel,
  ) {
    const voiceChannel = await guild.channels
      .create({
        name: `🔊${member.displayName}`,
        parent,
        type: ChannelType.GuildVoice,
        reason: `Create temp voice chat for ${member.displayName}`,
        permissionOverwrites: [
          {
            id: member.id,
            allow: [PermissionFlagsBits.ManageChannels],
          },
        ],
      })
      .catch(() => {
        member.voice.disconnect();
        return null;
      });
    if (voiceChannel) {
      await member.voice.setChannel(voiceChannel);
      this.RestrictCreateTempVoiceChat(member, joinToTalkChannel);
    }
  }

  private async RemoveTempVoiceChat(guild: Guild, parent: CategoryChannel) {
    const channelsCollection = guild.channels.cache.filter(
      (x) => x.parent === parent && x.type === ChannelType.GuildVoice,
    ) as Collection<string, VoiceChannel>;

    for (const [_, el] of channelsCollection) {
      if (el.members.size === 0) {
        await el.delete().catch(noop);
      }
    }
  }

  private RestrictCreateTempVoiceChat(member: GuildMember, joinToTalkChannel: VoiceBasedChannel) {
    joinToTalkChannel.permissionOverwrites.edit(member.id, { Connect: false });

    setTimeout(() => {
      joinToTalkChannel.permissionOverwrites.delete(member.id);
    }, 10_000);
  }
}
