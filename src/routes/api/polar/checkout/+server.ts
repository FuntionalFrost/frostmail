// src/routes/api/polar/checkout/+server.ts
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { usePolar } from '$lib/server/polar';
import { env } from '$env/dynamic/private';

export const POST: RequestHandler = async ({ request, url, locals }) => {
	const polar = usePolar();

	if (!polar) {
		throw error(
			500,
			'Polar Merchant of Record is not configured. Set POLAR_API_KEY in environment.'
		);
	}

	const body = (await request.json().catch(() => null)) as {
		productId?: string;
		customerEmail?: string;
		successUrl?: string;
	} | null;

	const productId = body?.productId || env.POLAR_PRO_PRODUCT_ID;

	if (!productId) {
		throw error(400, 'Missing Polar Product ID for checkout.');
	}

	const sessionUser = locals.user;
	const customerEmail = body?.customerEmail || sessionUser?.email || undefined;

	try {
		const checkout = await polar.checkouts.create({
			products: [productId],
			customerEmail,
			metadata: sessionUser?.id ? { userId: sessionUser.id } : undefined,
			successUrl: body?.successUrl || `${url.origin}/editor?upgrade=success`
		});

		return json({
			url: checkout.url,
			checkoutId: checkout.id
		});
	} catch (err: unknown) {
		const e = err as Error;
		throw error(502, e.message || 'Failed to create Polar checkout session.');
	}
};
