// src/routes/api/webhooks/polar/+server.ts
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { validateEvent, WebhookVerificationError } from '@polar-sh/sdk/webhooks';
import { getDb, user, subscriptions } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { env } from '$env/dynamic/private';

export const POST: RequestHandler = async ({ request }) => {
	const secret = env.POLAR_WEBHOOK_SECRET;
	const rawBody = await request.text();

	if (!rawBody) {
		throw error(400, 'Missing request body.');
	}

	const headersRecord: Record<string, string> = {};
	request.headers.forEach((v, k) => {
		headersRecord[k] = v;
	});

	let webhookPayload: { type: string; data: Record<string, unknown> };

	if (secret) {
		try {
			webhookPayload = validateEvent(rawBody, headersRecord, secret) as {
				type: string;
				data: Record<string, unknown>;
			};
		} catch (err: unknown) {
			if (err instanceof WebhookVerificationError) {
				throw error(403, 'Invalid Polar webhook signature.');
			}
			throw error(400, 'Malformed webhook payload.');
		}
	} else {
		try {
			webhookPayload = JSON.parse(rawBody) as { type: string; data: Record<string, unknown> };
		} catch {
			throw error(400, 'Invalid JSON payload.');
		}
	}

	const db = getDb();
	const { type, data } = webhookPayload;

	if (db && data) {
		const customer = (data.customer || {}) as { id?: string; email?: string; name?: string };
		const metadata = (data.metadata || {}) as { userId?: string };
		const customerEmail = (customer.email || data.customer_email || data.email) as
			string | undefined;

		let userId = metadata.userId;

		if (userId || customerEmail) {
			let existingUsers: (typeof user.$inferSelect)[] = [];

			if (userId) {
				existingUsers = await db.select().from(user).where(eq(user.id, userId)).limit(1);
			}

			if (existingUsers.length === 0 && customerEmail) {
				existingUsers = await db.select().from(user).where(eq(user.email, customerEmail)).limit(1);
			}

			if (existingUsers.length > 0 && existingUsers[0]) {
				userId = existingUsers[0].id;
			}

			// Handle subscription events
			if (userId && type.startsWith('subscription.')) {
				const targetUserId = userId;
				const subData = data as {
					id: string;
					product_id?: string;
					status: string;
					current_period_end?: string;
				};

				const existingSub = await db
					.select()
					.from(subscriptions)
					.where(eq(subscriptions.polarSubscriptionId, subData.id))
					.limit(1);

				if (existingSub.length > 0) {
					await db
						.update(subscriptions)
						.set({
							status: subData.status,
							currentPeriodEnd: subData.current_period_end
								? new Date(subData.current_period_end)
								: null,
							updatedAt: new Date()
						})
						.where(eq(subscriptions.polarSubscriptionId, subData.id));
				} else {
					await db.insert(subscriptions).values({
						id: `sub_${Date.now()}`,
						userId: targetUserId,
						polarSubscriptionId: subData.id,
						polarProductId: subData.product_id || null,
						status: subData.status,
						currentPeriodEnd: subData.current_period_end
							? new Date(subData.current_period_end)
							: null
					});
				}
			}
		}
	}

	return json({
		received: true,
		event: type
	});
};
