import { Events, GuildMember } from 'discord.js';
import { Minimal } from 'greetify';

import type Client from '@/classes/Client';
import Event from '@/classes/Event';

export default class MemberJoin extends Event {
  constructor(client: Client) {
    super(client, {
      name: Events.GuildMemberAdd,
      description: 'Member join',
      once: false,
    });
  }

  async Execute(member: GuildMember) {
    const { user, guild, roles } = member;
    const globalChannel = guild.channels.cache.get(this.client.GetSetting('global_channel_id') ?? '');

    if (!globalChannel || !globalChannel.isTextBased()) return;
    const card = await Minimal({
      name: user.username,
      avatar: user.displayAvatarURL({
        size: 4096,
      }),
      circleBorder: true,
      backgroundImage: 'https://ik.imagekit.io/eviloma/card-background',
      type: 'Welcome',
      message: `You are ${guild.memberCount}th member`,
      nameColor: '#6666ff',
    });

    await globalChannel.send({ files: [{ attachment: card, name: `welcome-${user.username}.png` }] });

    const initialRole = guild.roles.cache.get(this.client.GetSetting('join_role_id') ?? '');
    if (initialRole) {
      await roles.add(initialRole, 'User joined to server');
    }
  }
}
