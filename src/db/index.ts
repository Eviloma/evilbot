import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import env from '../libs/env';

// for query purposes
const queryClient = postgres(env.DATABASE_URL);
const db = drizzle(queryClient);

export default db;
