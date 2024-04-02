import type { Config } from 'drizzle-kit';

import env from '@/utils/env';

export default {
  driver: 'pg',
  schema: './src/db/schema.ts',
  out: './drizzle',
  dbCredentials: {
    connectionString: env.DATABASE_URL,
  },
} satisfies Config;
