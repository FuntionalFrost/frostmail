import { describe, expect, it } from 'vitest';
import { interpolateVariables } from '../src/lib/utils/interpolate';
import { templateToMjml } from '../src/lib/utils/mjmlGenerator';
import { templateToReactEmail } from '../src/lib/utils/reactEmailConverter';
import { presets } from '../src/lib/constants/presets';

describe('FrostMail Core AST Engine Unit Tests', () => {
	it('interpolateVariables handles nested keys and fallbacks', () => {
		const raw = 'Hello {{ user.name }}, order #{{ order.id }} has shipped!';
		const mockData = {
			user: { name: 'Alex' },
			order: { id: 'ORD-9821' }
		};
		const result = interpolateVariables(raw, mockData);
		expect(result).toBe('Hello Alex, order #ORD-9821 has shipped!');
	});

	it('interpolateVariables leaves unmatched keys unchanged', () => {
		const raw = 'Hello {{ missing.key }}!';
		const result = interpolateVariables(raw, {});
		expect(result).toBe('Hello {{ missing.key }}!');
	});

	it('templateToMjml generates valid MJML markup for presets', () => {
		const template = presets.welcome;
		const mjml = templateToMjml(template, { forCanvas: false });
		expect(mjml).toContain('<mjml>');
		expect(mjml).toContain('</mjml>');
		expect(mjml).toContain('<mj-body');
		expect(mjml).toContain('<mj-section');
	});

	it('templateToMjml injects block IDs when forCanvas is true', () => {
		const template = presets.welcome;
		const mjml = templateToMjml(template, { forCanvas: true });
		expect(mjml).toContain('mf-selectable');
		expect(mjml).toContain('mf-id-');
		expect(mjml).toContain('FROSTMAIL_BLOCK_CLICK');
	});

	it('templateToReactEmail generates JSX component string', () => {
		const template = presets.receipt;
		const reactCode = templateToReactEmail(template);
		expect(reactCode).toContain('import * as React');
		expect(reactCode).toContain('@react-email/components');
		expect(reactCode).toContain('export default OrderReceipt');
	});
});
