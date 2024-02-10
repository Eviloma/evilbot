import {
  ChannelType,
  Events,
  Guild,
  GuildMember,
  PermissionFlagsBits,
  VoiceBasedChannel,
  VoiceState,
} from 'discord.js';

import Client from '../../classes/Client';
import Event from '../../classes/Event';
import env from '../../libs/env';
import logger from '../../libs/logger';

const { JOIN_TO_TALK_CHANNEL_ID } = env;

const channels: Set<string> = new Set();

export default class VoiceStateUpdate extends Event {
  constructor(client: Client) {
    super(client, {
      name: Events.VoiceStateUpdate,
      description: 'VoiceStateUpdate',
      once: false,
    });
  }

  async Execute(oldState: VoiceState, newState: VoiceState) {
    const { channelId: oldChannelId, channel: oldChannel, member, guild } = oldState;
    const { channelId: newChannelId, channel: newChannel } = newState;

    if (newChannel && newChannelId === JOIN_TO_TALK_CHANNEL_ID && member) {
      this.CreateTempVoiceChat(member, guild, newChannel);
    }

    if (oldChannelId && oldChannel && channels.has(oldChannelId) && !newChannelId) {
      this.RemoveTempVoiceChat(oldChannel);
    }
  }

  private async CreateTempVoiceChat(member: GuildMember, guild: Guild, newChannel: VoiceBasedChannel) {
    const voiceChannel = await guild.channels
      .create({
        name: `🔊${member.displayName}`,
        parent: newChannel.parentId,
        type: ChannelType.GuildVoice,
        reason: 'Create temp voice chat',
        permissionOverwrites: [
          {
            id: member.id,
            allow: [PermissionFlagsBits.ManageChannels],
          },
        ],
      })
      .catch((error) => {
        logger.error(`CreateTempVoiceChat: ${error.message}`);
        member.voice.disconnect();
        return null;
      });

    if (voiceChannel) {
      member.voice.setChannel(voiceChannel);
      channels.add(voiceChannel.id);
      this.RestrictCreateTempVoiceChat(guild, member);
    }
  }

  private RemoveTempVoiceChat(channel: VoiceBasedChannel) {
    const membersCount = channel.members.size;

    if (membersCount === 0) {
      channel.delete();
      channels.delete(channel.id);
    }
  }

  private RestrictCreateTempVoiceChat(guild: Guild, member: GuildMember) {
    const joinToTalkChannel = guild.channels.cache.get(JOIN_TO_TALK_CHANNEL_ID);
    if (!joinToTalkChannel || !joinToTalkChannel.isVoiceBased()) return;

    joinToTalkChannel.permissionOverwrites.edit(member.id, { Connect: false });

    setTimeout(() => {
      joinToTalkChannel.permissionOverwrites.delete(member.id);
    }, 10_000);
  }
}
