// src/routes/api/compiler/compile/+server.ts
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { EmailTemplate, CompilerResult } from '#lib/types/email.js';
import { compileToHtml } from '#lib/server/mjmlCompiler.js';

export const POST: RequestHandler = async ({ request }) => {
	const body = (await request.json().catch(() => null)) as {
		template: EmailTemplate;
		mockData?: Record<string, unknown>;
	} | null;

	if (!body?.template || !body.template.body) {
		throw error(400, 'Invalid template payload');
	}

	const { html, errors } = await compileToHtml(body.template, body.mockData || {});
	const byteLength = new TextEncoder().encode(html).length;
	const sizeKb = Number((byteLength / 1024).toFixed(2));

	const result: CompilerResult = {
		html,
		errors,
		sizeKb,
		isClippedInGmail: sizeKb > 102
	};

	return Response.json(result);
};
