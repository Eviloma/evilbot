/* eslint-disable no-console */
import 'dotenv/config';

import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { cleanEnv, str } from 'envalid';
import postgres from 'postgres';

const env = cleanEnv(process.env, {
  DATABASE_URL: str(),
});

const migrationClient = postgres(env.DATABASE_URL, { max: 1 });

console.log('Strating migration...');
await migrate(drizzle(migrationClient), { migrationsFolder: './drizzle' }).catch((error) => {
  console.error(error);
  process.exit(1);
});
await migrationClient.end().catch((error) => {
  console.error(error);
  process.exit(1);
});
console.log('Migration completed');
