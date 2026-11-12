// src/routes/api/webhooks/polar/+server.ts
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { webhooks } from '@polar-sh/sdk/2026-10';
import { getDb, user, subscriptions } from '#lib/server/db/index.js';
import { eq } from 'drizzle-orm';
import { POLAR_WEBHOOK_SECRET } from '$app/env/private';

export const POST: RequestHandler = async ({ request }) => {
	const secret = POLAR_WEBHOOK_SECRET;
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
			const validated = await webhooks.validateEvent(rawBody, headersRecord, secret);
			webhookPayload = validated as unknown as {
				type: string;
				data: Record<string, unknown>;
			};
		} catch (err: unknown) {
			if (err instanceof webhooks.PolarWebhookVerificationError) {
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

		let targetUserId = metadata.userId;

		if (!targetUserId && customerEmail) {
			const existingUser = await db.query.user.findFirst({
				where: eq(user.email, customerEmail)
			});
			if (existingUser) {
				targetUserId = existingUser.id;
			}
		}

		if (targetUserId) {
			if (type === 'subscription.created' || type === 'subscription.updated') {
				const subData = data as {
					id: string;
					status?: string;
					current_period_end?: string | number;
					product_id?: string;
				};

				const periodEnd = subData.current_period_end
					? new Date(subData.current_period_end)
					: undefined;

				const existing = await db
					.select()
					.from(subscriptions)
					.where(eq(subscriptions.polarSubscriptionId, subData.id))
					.limit(1);

				if (existing.length > 0) {
					await db
						.update(subscriptions)
						.set({
							status: subData.status || 'active',
							currentPeriodEnd: periodEnd,
							updatedAt: new Date()
						})
						.where(eq(subscriptions.polarSubscriptionId, subData.id));
				} else {
					await db.insert(subscriptions).values({
						id: crypto.randomUUID(),
						userId: targetUserId,
						polarSubscriptionId: subData.id,
						polarProductId: subData.product_id || null,
						status: subData.status || 'active',
						currentPeriodEnd: periodEnd
					});
				}
			} else if (type === 'subscription.revoked') {
				const subData = data as { id: string };
				await db
					.update(subscriptions)
					.set({
						status: 'canceled',
						updatedAt: new Date()
					})
					.where(eq(subscriptions.polarSubscriptionId, subData.id));
			}
		}
	}

	return Response.json({ received: true });
};
