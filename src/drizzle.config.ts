import type { Config } from 'drizzle-kit';

import env from './libs/env';

export default {
  driver: 'pg',
  schema: './src/db/schemas/*.ts',
  out: './drizzle',
  dbCredentials: {
    connectionString: env.DATABASE_URL,
  },
} satisfies Config;
