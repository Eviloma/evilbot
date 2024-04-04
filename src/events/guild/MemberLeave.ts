import { Events, GuildMember } from 'discord.js';

import type Client from '@/classes/Client';
import Event from '@/classes/Event';

export default class MemberLeave extends Event {
  constructor(client: Client) {
    super(client, {
      name: Events.GuildMemberRemove,
      description: 'Member leave',
      once: false,
    });
  }

  async Execute(member: GuildMember) {
    // const { user, guild } = member;
    // const globalChannel = guild.channels.cache.get(this.client.GetSetting('global_channel_id') ?? '');
    // if (!globalChannel || !globalChannel.isTextBased()) return;
    // await Font.fromFile('/src/assets/Raleway.ttf');
    // const card = new GreetingsCard()
    //   .setAvatar(user.displayAvatarURL({ forceStatic: true }))
    //   .setDisplayName(user.username)
    //   .setType('goodbye');
    // const image = await card.build({ format: 'png' });
    // await globalChannel.send({ files: [image] });
  }
}
