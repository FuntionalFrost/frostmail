import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';
import { env } from '$env/dynamic/private';

export function getDb() {
	const connectionString = env.DATABASE_URL;
	if (!connectionString) {
		return null;
	}
	const client = neon(connectionString);
	return drizzle(client, { schema });
}

export const db = env.DATABASE_URL
	? drizzle(neon(env.DATABASE_URL), { schema })
	: (null as unknown as ReturnType<typeof drizzle<typeof schema>>);

export * from './schema';
