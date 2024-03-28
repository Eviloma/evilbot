import DiscordOauth2 from 'discord-oauth2';
import { eq } from 'drizzle-orm';
import express from 'express';
import { find } from 'lodash';

import db from '../db';
import { guildSchema } from '../db/schemas/guild';
import IWebServer from '../interfaces/IWebServer';
import env from '../libs/env';
import logger from '../libs/logger';
import Client from './Client';

export default class WebServer implements IWebServer {
  client;

  app;

  oauth;

  constructor(client: Client) {
    this.app = express();
    this.client = client;
    this.oauth = new DiscordOauth2({ version: 'v10', clientId: env.CLIENT_ID, clientSecret: env.CLIENT_SECRET });

    this.Init();
  }

  Init(): void {
    this.app.get('/', (_, res) => {
      res.send('Ok');
    });

    this.app.get('/valorant/callback', async (req, res) => {
      try {
        const token = await this.oauth
          .tokenRequest({
            code: req.query.code as string,
            scope: ['identify', 'connections'],
            redirectUri: `${env.BASE_URL}/valorant/callback`,
            grantType: 'authorization_code',
          })
          .then((response) => response.access_token);

        const user = await this.oauth.getUser(token);
        const connections = await this.oauth.getUserConnections(token);

        const valorantID = find(connections, ['type', 'riotgames']);

        if (!valorantID) {
          this.client.users.cache.get(user.id)?.send(
            // eslint-disable-next-line no-secrets/no-secrets
            "Не знайдено зв'язаного RiotID з вашим аккаунтом Discord.\nhttps://www.youtube.com/watch?v=pgx9rA9F4jo"
          );
          throw new Error("Не знайдено зв'язаного RiotID з вашим аккаунтом Discord.");
        }

        const searchUser = await db.select().from(guildSchema).where(eq(guildSchema.user, user.id));

        await (searchUser.length === 0
          ? db.insert(guildSchema).values({ user: user.id, valorant: valorantID.name })
          : db.update(guildSchema).set({ valorant: valorantID.name }).where(eq(guildSchema.user, user.id)));

        this.client.users.cache.get(user.id)?.send(`Ваш аккаунт успішно зв'язано з вашим RiotID: ${valorantID.name}`);
        res.status(200).send(`Ваш аккаунт успішно зв'язано з вашим RiotID: ${valorantID.name}`);
      } catch (error) {
        res.status(500).send(error);
      }
    });

    this.app.listen(env.PORT, () => {
      logger.info(`[Webserver] Server started on port ${env.PORT}`);
    });
  }
}
