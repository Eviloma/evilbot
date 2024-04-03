import Client from '@/classes/Client';
import HealthRoute from '@/routes/health';
import ValorantRoute from '@/routes/valorant';
import env from '@/utils/env';

if (env.isProd) {
  await import('./migrate');
}

const client = new Client();
client.Init();

Bun.serve({
  fetch(req) {
    const url = new URL(req.url);
    if (url.pathname === '/') return HealthRoute();
    if (url.pathname === '/valorant') return ValorantRoute(req, client);
    return new Response(null, { status: 404 });
  },
});
