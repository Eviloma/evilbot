import { Events } from 'discord.js';
import { ChannelDeletePacket, VoicePacket, VoiceServer, VoiceState } from 'lavalink-client';

import Client from '../../classes/Client';
import Event from '../../classes/Event';

export default class Raw extends Event {
  constructor(client: Client) {
    super(client, {
      name: Events.Raw,
      description: 'Raw',
      once: false,
    });
  }

  async Execute(d: VoicePacket | VoiceServer | VoiceState | ChannelDeletePacket) {
    this.client.lavalink.sendRawData(d);
  }
}
