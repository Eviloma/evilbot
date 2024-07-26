import Client from "@/classes/Client";
import HealthRoute from "@/routes";
import ValorantCallback from "@/routes/valorant/callback";
import env from "@/utils/env";

if (env.isProd) {
  await import("./migrate");
}

const client = new Client();
client.Init();

Bun.serve({
  fetch(req) {
    const url = new URL(req.url);
    if (url.pathname === "/") return HealthRoute();
    if (url.pathname === "/valorant/callback") return ValorantCallback(req, client);
    return new Response("Not Found", { status: 404 });
  },
});
