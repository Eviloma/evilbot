import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import env from '@/utils/env';

import * as schema from './schema';

const queryClient = postgres(env.DATABASE_URL);
const database = drizzle(queryClient, { schema });

export default database;
