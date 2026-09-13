// src/routes/api/templates/+server.ts
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDb, templates } from '$lib/server/db';
import type { EmailTemplate } from '$lib/types/email';
import { desc, eq } from 'drizzle-orm';

export const GET: RequestHandler = async ({ locals }) => {
	const user = locals.user;
	if (!user?.id) {
		return json([]);
	}

	const db = getDb();
	if (!db) {
		return json([]);
	}

	try {
		const list = await db
			.select()
			.from(templates)
			.where(eq(templates.userId, user.id))
			.orderBy(desc(templates.updatedAt));

		return json(
			list.map((item) => ({
				id: item.id,
				name: item.name,
				updatedAt: item.updatedAt.toISOString(),
				template: item.templateData
			}))
		);
	} catch (err: unknown) {
		const e = err as Error;
		console.error('Failed to query cloud templates:', e.message);
		return json([]);
	}
};

export const POST: RequestHandler = async ({ request, locals }) => {
	const body = (await request.json().catch(() => null)) as {
		id?: string;
		name: string;
		template: EmailTemplate;
	} | null;

	if (!body?.template) {
		throw error(400, 'Template data is required.');
	}

	const db = getDb();
	const user = locals.user;

	if (!db || !user?.id) {
		return json({
			success: true,
			syncedToCloud: false,
			message: 'Saved locally (Log in to sync to cloud database).'
		});
	}

	const templateId = body.id || `tpl_${Date.now()}`;
	const targetName = body.name || body.template.name || 'Untitled Template';

	try {
		const existing = await db.select().from(templates).where(eq(templates.id, templateId)).limit(1);

		if (existing.length > 0) {
			if (existing[0]?.userId && existing[0].userId !== user.id) {
				throw error(403, 'Unauthorized to modify this template.');
			}

			await db
				.update(templates)
				.set({
					name: targetName,
					subject: body.template.subject,
					preheader: body.template.preheader,
					templateData: body.template,
					updatedAt: new Date()
				})
				.where(eq(templates.id, templateId));
		} else {
			await db.insert(templates).values({
				id: templateId,
				userId: user.id,
				name: targetName,
				subject: body.template.subject,
				preheader: body.template.preheader,
				templateData: body.template
			});
		}

		return json({
			success: true,
			syncedToCloud: true,
			id: templateId
		});
	} catch (err: unknown) {
		if (typeof err === 'object' && err !== null && 'status' in err) {
			throw err;
		}
		const e = err as Error;
		throw error(500, e.message || 'Failed to save template to cloud database.');
	}
};
