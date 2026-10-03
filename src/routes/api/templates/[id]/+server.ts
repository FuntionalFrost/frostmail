// src/routes/api/templates/[id]/+server.ts
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDb, templates } from '#lib/server/db/index.js';
import { and, eq } from 'drizzle-orm';

export const DELETE: RequestHandler = async ({ params, locals }) => {
	const id = params.id;

	if (!id) {
		throw error(400, 'Template ID is required.');
	}

	const user = locals.user;
	const db = getDb();

	if (!db || !user?.id) {
		return Response.json({ success: true, syncedToCloud: false });
	}

	try {
		await db.delete(templates).where(and(eq(templates.id, id), eq(templates.userId, user.id)));

		return Response.json({ success: true, syncedToCloud: true });
	} catch (err: unknown) {
		const e = err as Error;
		throw error(500, e.message || 'Failed to delete template from database.');
	}
};
