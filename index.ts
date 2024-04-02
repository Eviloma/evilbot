import Client from '@/classes/Client';
import env from '@/utils/env';

if (env.isProd) {
  await import('./migrate');
}

new Client().Init();
