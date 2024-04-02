#!/usr/bin/env node
/* eslint-disable no-console */

import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { cleanEnv, str } from 'envalid';
import postgres from 'postgres';

const environment = cleanEnv(process.env, {
  DATABASE_URL: str(),
});

const migrationClient = postgres(environment.DATABASE_URL, { max: 1, idle_timeout: 30 });

console.log('Strating migration...');
await migrate(drizzle(migrationClient), { migrationsFolder: './drizzle' });
console.log('Migration completed');
