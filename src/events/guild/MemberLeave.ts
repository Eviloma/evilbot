import { Events, GuildMember } from 'discord.js';

import Client from '../../classes/Client';
import Event from '../../classes/Event';
import env from '../../libs/env';

export default class MemberLeave extends Event {
  constructor(client: Client) {
    super(client, {
      name: Events.GuildMemberRemove,
      description: 'Member leave',
      once: false,
    });
  }

  async Execute(member: GuildMember) {
    const { guild } = member;
    const globalChannel = guild.channels.cache.get(env.GLOBAL_CHANNEL_ID);

    if (!globalChannel || !globalChannel.isTextBased()) return;

    await globalChannel.send({});
  }
}
