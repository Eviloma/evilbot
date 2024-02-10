import {
  CategoryChannel,
  ChannelType,
  Collection,
  Events,
  Guild,
  GuildMember,
  PermissionFlagsBits,
  VoiceChannel,
  VoiceState,
} from 'discord.js';
import { noop } from 'lodash';

import Client from '../../classes/Client';
import Event from '../../classes/Event';
import env from '../../libs/env';
import logger from '../../libs/logger';

const { JOIN_TO_TALK_CHANNEL_ID } = env;

export default class VoiceStateUpdate extends Event {
  constructor(client: Client) {
    super(client, {
      name: Events.VoiceStateUpdate,
      description: 'VoiceStateUpdate',
      once: false,
    });
  }

  async Execute(oldState: VoiceState, newState: VoiceState) {
    const { member, guild } = oldState;
    const { channel: newChannel } = newState;
    const parent = guild.channels.cache.find(
      (x) => x.id === env.JOIN_TO_TALK_PARENT_ID && x.type === ChannelType.GuildCategory
    ) as CategoryChannel | undefined;

    if (!parent) return;

    if (newChannel && newChannel.id === JOIN_TO_TALK_CHANNEL_ID && member) {
      await this.CreateTempVoiceChat(member, guild, parent);
    }

    await this.RemoveTempVoiceChat(guild, parent);
  }

  private async CreateTempVoiceChat(member: GuildMember, guild: Guild, parent: CategoryChannel) {
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
      .catch((error) => {
        logger.error(`CreateTempVoiceChat: ${error.message}`);
        member.voice.disconnect();
        return null;
      });

    if (voiceChannel) {
      await member.voice.setChannel(voiceChannel);
      this.RestrictCreateTempVoiceChat(guild, member);
    }
  }

  private async RemoveTempVoiceChat(guild: Guild, parent: CategoryChannel) {
    const channels = guild.channels.cache.filter(
      (x) => x.parent === parent && x.type === ChannelType.GuildVoice
    ) as Collection<string, VoiceChannel>;

    channels.forEach(async (x) => {
      if (x.members.size === 0) {
        await x.delete().catch(noop);
      }
    });
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
