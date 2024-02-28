import {
  CategoryChannel,
  ChannelType,
  Collection,
  Events,
  Guild,
  GuildMember,
  PermissionFlagsBits,
  VoiceBasedChannel,
  VoiceChannel,
  VoiceState,
} from 'discord.js';
import { eq } from 'drizzle-orm';
import { constant, noop } from 'lodash';

import Client from '../../classes/Client';
import Event from '../../classes/Event';
import db from '../../db';
import { settingsSchema } from '../../db/schemas/settings';

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

    if (!guild || !member) return;

    // Find settings for this guild in database
    const data = await db
      .select()
      .from(settingsSchema)
      .where(eq(settingsSchema.guild_id, guild.id))
      .limit(1)
      .catch(constant(null));

    // If no settings found, return
    if (!data || data.length === 0) return;

    // Get channel and parent from settings in database
    const joinToTalkChannel = guild.channels.cache.get(data[0].join_to_channel_id);
    const parent = guild.channels.cache.get(data[0].temp_voice_channels_category_id);

    // If channel or parent not found or channel not voice channel or parent not category, return
    if (!joinToTalkChannel || !parent || !joinToTalkChannel.isVoiceBased() || parent.type !== ChannelType.GuildCategory)
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
    parent: CategoryChannel
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
    const channels = guild.channels.cache.filter(
      (x) => x.parent === parent && x.type === ChannelType.GuildVoice
    ) as Collection<string, VoiceChannel>;

    channels.forEach(async (x) => {
      if (x.members.size === 0) {
        await x.delete().catch(noop);
      }
    });
  }

  private RestrictCreateTempVoiceChat(member: GuildMember, joinToTalkChannel: VoiceBasedChannel) {
    joinToTalkChannel.permissionOverwrites.edit(member.id, { Connect: false });

    setTimeout(() => {
      joinToTalkChannel.permissionOverwrites.delete(member.id);
    }, 10_000);
  }
}
