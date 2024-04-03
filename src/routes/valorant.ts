import { eq } from 'drizzle-orm';
import { find } from 'lodash';

import type Client from '@/classes/Client';
import db from '@/db';
import { guildSchema } from '@/db/schema';

export default async function ValorantRoute(req: Request, client: Client): Promise<Response> {
  try {
    const url = new URL(req.url);
    const token = await client.oauth
      .tokenRequest({
        code: url.searchParams.get('code') as string,
        scope: ['identify', 'connections'],
        redirectUri: `${url.hostname}/valorant/callback`,
        grantType: 'authorization_code',
      })
      .then((response) => response.access_token);

    const user = await client.oauth.getUser(token);
    const connections = await client.oauth.getUserConnections(token);

    const valorantID = find(connections, ['type', 'riotgames']);

    if (!valorantID) {
      client.users.cache
        .get(user.id)
        // eslint-disable-next-line no-secrets/no-secrets
        ?.send("Не знайдено зв'язаного RiotID з вашим аккаунтом Discord.\nhttps://www.youtube.com/watch?v=pgx9rA9F4jo");
      throw new Error("Не знайдено зв'язаного RiotID з вашим аккаунтом Discord.");
    }

    const searchUser = await db.select().from(guildSchema).where(eq(guildSchema.user, user.id));

    await (searchUser.length === 0
      ? db.insert(guildSchema).values({ user: user.id, valorant: valorantID.name })
      : db.update(guildSchema).set({ valorant: valorantID.name }).where(eq(guildSchema.user, user.id)));

    client.users.cache.get(user.id)?.send(`Ваш аккаунт успішно зв'язано з вашим RiotID: ${valorantID.name}`);
    return new Response(`Ваш аккаунт успішно зв'язано з вашим RiotID: ${valorantID.name}`);
  } catch (error) {
    return new Response((error as Error).message, { status: 500 });
  }
}
