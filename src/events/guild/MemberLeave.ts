import path from 'node:path';

import { Font } from 'canvacord';
import { Events, GuildMember } from 'discord.js';

import GreetingsCard from '../../canvas/GreetingsCard';
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
    const { user, guild } = member;
    const globalChannel = guild.channels.cache.get(env.GLOBAL_CHANNEL_ID);

    if (!globalChannel || !globalChannel.isTextBased()) return;

    await Font.fromFile(path.join(__dirname, '../../Raleway.ttf'));

    const card = new GreetingsCard()
      .setAvatar(user.displayAvatarURL({ forceStatic: true }))
      .setDisplayName(user.username)
      .setType('goodbye');

    const image = await card.build({ format: 'png' });

    await globalChannel.send({ files: [image] });
  }
}
