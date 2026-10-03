import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';
import { DATABASE_URL } from '$app/env/private';

export function getDb() {
	const connectionString = DATABASE_URL;
	if (!connectionString) {
		return null;
	}
	const client = neon(connectionString);
	return drizzle(client, { schema });
}

export const db = DATABASE_URL
	? drizzle(neon(DATABASE_URL), { schema })
	: (null as unknown as ReturnType<typeof drizzle<typeof schema>>);

export * from './schema';
