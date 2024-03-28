import DiscordOauth2 from 'discord-oauth2';

import Client from '../classes/Client';

export default interface IWebServer {
  client: Client;
  app: Express.Application;
  oauth: DiscordOauth2;

  Init(): void;
}
