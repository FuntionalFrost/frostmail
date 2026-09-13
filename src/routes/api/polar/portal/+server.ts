// src/routes/api/polar/portal/+server.ts
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { usePolar } from '$lib/server/polar';

export const POST: RequestHandler = async ({ request }) => {
	const polar = usePolar();

	if (!polar) {
		throw error(500, 'Polar Merchant of Record is not configured.');
	}

	const body = (await request.json().catch(() => null)) as {
		customerId: string;
	} | null;

	if (!body?.customerId) {
		throw error(400, 'Customer ID is required to generate customer portal session.');
	}

	try {
		const session = await polar.customerSessions.create({
			customerId: body.customerId
		});

		return json({
			url: session.customerPortalUrl,
			token: session.token
		});
	} catch (err: unknown) {
		const e = err as Error;
		throw error(502, e.message || 'Failed to generate Polar customer portal link.');
	}
};
