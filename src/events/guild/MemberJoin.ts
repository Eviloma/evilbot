import { Events, GuildMember } from 'discord.js';

import GreetingsCard from '../../canvas/GreetingsCard';
import Client from '../../classes/Client';
import Event from '../../classes/Event';
import env from '../../libs/env';

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
    const globalChannel = guild.channels.cache.get(env.GLOBAL_CHANNEL_ID);

    if (!globalChannel || !globalChannel.isTextBased()) return;

    const card = new GreetingsCard()
      .setAvatar(user.displayAvatarURL({ forceStatic: true }))
      .setDisplayName(user.username)
      .setType('welcome')
      .setMessage(`Вітаємо на сервері ${guild.name}!`);

    const image = await card.build({ format: 'png' });

    await globalChannel.send({ files: [image] });
    await roles.add(env.DEFAULT_MEMBER_ROLE_ID);
  }
}
