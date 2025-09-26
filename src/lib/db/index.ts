import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import 'dotenv/config';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Enforce SSL connection for serverless environments.
const client = postgres(process.env.DATABASE_URL, { max: 1, ssl: 'require' });
export const db = drizzle(client, { schema });
