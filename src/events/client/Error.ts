import { Events } from 'discord.js';

import Client from '../../classes/Client';
import Event from '../../classes/Event';
import logger from '../../libs/logger';

export default class Error extends Event {
  constructor(client: Client) {
    super(client, {
      name: Events.Error,
      description: 'Client error',
      once: false,
    });
  }

  async Execute(error: Error) {
    logger.error(error.description);
  }
}
