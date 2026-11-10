// tests/highlighter.test.ts
import { describe, expect, it } from 'vitest';
import { tokenizeMjmlLine, tokenizeMarkup } from '../src/lib/utils/mjmlHighlighter';

describe('MJML Markup Syntax Highlighter Tests', () => {
	it('tokenizes standard MJML tags and closing brackets', () => {
		const line = '<mjml>';
		const tokens = tokenizeMjmlLine(line);
		expect(tokens).toEqual([
			{ text: '<mjml', type: 'tag' },
			{ text: '>', type: 'punctuation' }
		]);
	});

	it('tokenizes closing MJML tags', () => {
		const line = '</mj-section>';
		const tokens = tokenizeMjmlLine(line);
		expect(tokens).toEqual([
			{ text: '</mj-section', type: 'tag' },
			{ text: '>', type: 'punctuation' }
		]);
	});

	it('tokenizes attributes and string values', () => {
		const line = '  <mj-column width="600px" background-color="#ffffff">';
		const tokens = tokenizeMjmlLine(line);
		expect(tokens.some((t) => t.type === 'tag' && t.text === '<mj-column')).toBe(true);
		expect(tokens.some((t) => t.type === 'attr-name' && t.text === 'width')).toBe(true);
		expect(tokens.some((t) => t.type === 'attr-value' && t.text === '"600px"')).toBe(true);
		expect(tokens.some((t) => t.type === 'attr-name' && t.text === 'background-color')).toBe(true);
		expect(tokens.some((t) => t.type === 'attr-value' && t.text === '"#ffffff"')).toBe(true);
	});

	it('tokenizes self-closing tags with />', () => {
		const line = '  <mj-image src="logo.png" alt="Company Logo" />';
		const tokens = tokenizeMjmlLine(line);
		expect(tokens.some((t) => t.type === 'tag' && t.text === '<mj-image')).toBe(true);
		expect(tokens.some((t) => t.type === 'punctuation' && t.text === '/>')).toBe(true);
	});

	it('tokenizes dynamic merge variables inside body text', () => {
		const line =
			'    <mj-text>Hello {{ user.name }}, your order #{{ order.id }} is confirmed.</mj-text>';
		const tokens = tokenizeMjmlLine(line);
		const mergeVars = tokens.filter((t) => t.type === 'merge-var');
		expect(mergeVars.length).toBe(2);
		expect(mergeVars[0].text).toBe('{{ user.name }}');
		expect(mergeVars[1].text).toBe('{{ order.id }}');
	});

	it('tokenizes dynamic merge variables inside attribute strings', () => {
		const line = '    <mj-button href="{{ invoice.url }}">Download Invoice</mj-button>';
		const tokens = tokenizeMjmlLine(line);
		expect(tokens.some((t) => t.type === 'merge-var' && t.text === '{{ invoice.url }}')).toBe(true);
	});

	it('tokenizes HTML / MSO comments correctly with leading whitespace', () => {
		const line = '  <!--[if mso]><v:roundrect><![endif]-->';
		const tokens = tokenizeMjmlLine(line);
		expect(tokens.some((t) => t.type === 'comment' && t.text.includes('<!--[if mso]'))).toBe(true);
	});

	it('tokenizes multi-line markup properly', () => {
		const code = `<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text>Welcome {{ user.name }}</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;
		const lines = tokenizeMarkup(code);
		expect(lines.length).toBe(9);
		expect(lines[0][0].text).toBe('<mjml');
		expect(lines[8][0].text).toBe('</mjml');
	});
});
