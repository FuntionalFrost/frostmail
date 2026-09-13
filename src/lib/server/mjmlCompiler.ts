// src/lib/server/mjmlCompiler.ts
import mjml2html from 'mjml';
import type { EmailTemplate } from '$lib/types/email';
import { templateToMjml } from '$lib/utils/mjmlGenerator';
import { interpolateVariables } from '$lib/utils/interpolate';

export async function compileToHtml(
	template: EmailTemplate,
	mockData: Record<string, unknown> = {},
	options: { forCanvas?: boolean } = { forCanvas: true }
): Promise<{
	html: string;
	errors: Array<{ line: number; message: string; tagName: string }>;
}> {
	try {
		let mjmlString: string = templateToMjml(template, options) || '';

		if (Object.keys(mockData).length > 0) {
			mjmlString = interpolateVariables(mjmlString, mockData) || '';
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const compileFn: any =
			typeof mjml2html === 'function'
				? mjml2html
				: (mjml2html as unknown as { default: typeof mjml2html }).default || mjml2html;

		const res = compileFn(mjmlString, { validationLevel: 'soft' });
		const result = res instanceof Promise ? await res : res;

		return {
			html: result?.html || '',
			errors: (result?.errors as Array<{ line: number; message: string; tagName: string }>) || []
		};
	} catch (err: unknown) {
		const error = err as Error;
		return {
			html: `<div style="padding: 20px; color: #dc2626; font-family: sans-serif;"><h3>Template Compilation Error</h3><pre>${error.message}</pre></div>`,
			errors: [{ line: 0, message: error.message, tagName: 'mjml' }]
		};
	}
}
