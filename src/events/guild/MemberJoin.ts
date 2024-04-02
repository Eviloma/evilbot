import { Font } from 'canvacord';
import { Events, GuildMember } from 'discord.js';

import GreetingsCard from '@/canvases/GreetingsCard';
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
    const { user, guild } = member;
    const globalChannel = guild.channels.cache.get(this.client.GetSetting('global_channel_id') ?? '');

    if (!globalChannel || !globalChannel.isTextBased()) return;
    await Font.fromFile('src/assets/Raleway.ttf');

    const card = new GreetingsCard()
      .setAvatar(user.displayAvatarURL({ forceStatic: true }))
      .setDisplayName(user.username)
      .setType('welcome')
      .setMessage(`Вітаємо на сервері ${guild.name}!`);

    const image = await card.build({ format: 'png' });

    await globalChannel.send({ content: `<@${user.id}>`, files: [image] });

    const initialRole = guild.roles.cache.get(this.client.GetSetting('join_role_id') ?? '');
    if (initialRole) {
      await member.roles.add(initialRole, 'User joined to server');
    }
  }
}
