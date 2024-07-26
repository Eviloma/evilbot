import { find } from "lodash";

import type Client from "@/classes/Client";
import env from "@/utils/env";

export default async function ValorantCallback(req: Request, client: Client): Promise<Response> {
  try {
    const url = new URL(req.url);
    const token = await client.oauth
      .tokenRequest({
        code: url.searchParams.get("code") as string,
        scope: ["identify", "connections"],
        redirectUri: `${env.BASE_URL}/valorant/callback`,
        grantType: "authorization_code",
      })
      .then((response) => response.access_token);

    const user = await client.oauth.getUser(token);
    const connections = await client.oauth.getUserConnections(token);

    const valorantID = find(connections, ["type", "riotgames"]);

    if (!valorantID) {
      client.users.cache
        .get(user.id)
        ?.send("No RiotID found associated with your Discord account.\nhttps://www.youtube.com/watch?v=pgx9rA9F4jo");
      throw new Error("No RiotID found associated with your Discord account.");
    }

    if (!valorantID?.verified) {
      client.users.cache
        .get(user.id)
        ?.send("Your RiotID is not verified.\nhttps://www.youtube.com/watch?v=pgx9rA9F4jo");
      throw new Error("Your RiotID is not verified.");
    }

    // const searchUser = await db.select().from(connectionsSchema).where(eq(connectionsSchema.userId, user.id));

    // await (searchUser.length === 0
    //   ? db.insert(connectionsSchema).values({ userId: user.id, valorantPUUID: valorantID.name })
    //   : db
    //       .update(connectionsSchema)
    //       .set({ valorantPUUID: valorantID.name })
    //       .where(eq(connectionsSchema.userId, user.id)));

    client.users.cache
      .get(user.id)
      ?.send(`Your account has been successfully linked to your RiotID: ${valorantID.name}`);
    return new Response(
      `Your account has been successfully linked to your RiotID: ${valorantID.name}. You can close this tab now.`,
      { status: 200 },
    );
  } catch (error) {
    return new Response((error as Error).message, { status: 500 });
  }
}
