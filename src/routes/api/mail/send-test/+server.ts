// src/routes/api/mail/send-test/+server.ts
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { EmailTemplate } from '#lib/types/email.js';
import { compileToHtml } from '#lib/server/mjmlCompiler.js';
import { RESEND_API_KEY } from '$app/env/private';

export const POST: RequestHandler = async ({ request }) => {
	const body = (await request.json().catch(() => null)) as {
		to: string;
		apiKey?: string;
		from?: string;
		template: EmailTemplate;
		mockData?: Record<string, unknown>;
	} | null;

	if (!body?.to || !body?.template) {
		throw error(400, 'Recipient email address and template are required.');
	}

	const apiKey = body.apiKey?.trim() || RESEND_API_KEY;

	if (!apiKey) {
		throw error(401, 'No Resend API Key provided. Enter a key or set RESEND_API_KEY in .env.');
	}

	// Compile clean HTML without canvas selection attributes
	const { html } = await compileToHtml(body.template, body.mockData || {}, {
		forCanvas: false
	});

	try {
		const res = await fetch('https://api.resend.com/emails', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${apiKey}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				from: body.from || 'FrostMail <onboarding@resend.dev>',
				to: [body.to],
				subject: body.template.subject || 'Test Email from FrostMail',
				html
			})
		});

		if (!res.ok) {
			const errData = (await res.json().catch(() => ({}))) as { message?: string };
			throw error(502, errData.message || 'Failed to dispatch test email via Resend.');
		}

		const data = (await res.json()) as { id: string };

		return Response.json({
			success: true,
			messageId: data.id,
			recipient: body.to
		});
	} catch (err: unknown) {
		if (typeof err === 'object' && err !== null && 'status' in err) {
			throw err;
		}
		const e = err as Error;
		throw error(502, e.message || 'Failed to dispatch test email via Resend.');
	}
};
