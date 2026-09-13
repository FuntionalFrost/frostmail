// src/lib/utils/interpolate.ts

export function interpolateVariables(
	html: string = '',
	mockData: Record<string, unknown> = {}
): string {
	if (!html) return '';
	return html.replace(/\{\{\s*([\w.-]+)\s*\}\}/g, (match, key) => {
		const keys = key.split('.');
		let value: unknown = mockData;
		for (const k of keys) {
			if (typeof value === 'object' && value !== null && k in value) {
				value = (value as Record<string, unknown>)[k];
			} else {
				return match;
			}
		}
		return value !== undefined && value !== null ? String(value) : '';
	});
}
