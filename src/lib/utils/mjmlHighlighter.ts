// src/lib/utils/mjmlHighlighter.ts

export type TokenType =
	| 'tag'
	| 'attr-name'
	| 'attr-value'
	| 'string'
	| 'comment'
	| 'merge-var'
	| 'punctuation'
	| 'keyword'
	| 'number'
	| 'plain';

export interface Token {
	text: string;
	type: TokenType;
}

/**
 * Tokenizes a single line of MJML/XML/HTML markup into styled syntax tokens.
 */
export function tokenizeMjmlLine(line: string): Token[] {
	if (!line) {
		return [{ text: '', type: 'plain' }];
	}

	const tokens: Token[] = [];
	let remaining = line;

	while (remaining.length > 0) {
		// 0. Explicit whitespace preservation
		const wsMatch = remaining.match(/^\s+/);
		if (wsMatch) {
			tokens.push({ text: wsMatch[0], type: 'plain' });
			remaining = remaining.slice(wsMatch[0].length);
			continue;
		}

		// 1. Comments: <!-- ... --> (including MSO conditionals <!--[if mso]> ... <![endif]-->)
		if (remaining.startsWith('<!--')) {
			const closeIdx = remaining.indexOf('-->');
			if (closeIdx !== -1) {
				const endIdx = closeIdx + 3;
				tokens.push({ text: remaining.slice(0, endIdx), type: 'comment' });
				remaining = remaining.slice(endIdx);
				continue;
			} else {
				tokens.push({ text: remaining, type: 'comment' });
				break;
			}
		}

		// 2. Dynamic Merge Variables: {{ user.name }}, {{ order.id }}, etc.
		const mergeMatch = remaining.match(/^(\{\{[^{}]*\}\})/);
		if (mergeMatch) {
			tokens.push({ text: mergeMatch[1], type: 'merge-var' });
			remaining = remaining.slice(mergeMatch[1].length);
			continue;
		}

		// 3. Opening or Closing Tag: </mj-..., <mj-..., </table, <table, <a, </a, etc.
		const tagStartMatch = remaining.match(/^(<\/?[a-zA-Z0-9_-]+)/);
		if (tagStartMatch) {
			tokens.push({ text: tagStartMatch[1], type: 'tag' });
			remaining = remaining.slice(tagStartMatch[1].length);
			continue;
		}

		// 4. Tag closing punctuation: /> or >
		const tagEndMatch = remaining.match(/^(\/?>)/);
		if (tagEndMatch) {
			tokens.push({ text: tagEndMatch[1], type: 'punctuation' });
			remaining = remaining.slice(tagEndMatch[1].length);
			continue;
		}

		// 5. Attribute names before = (e.g. background-color=, font-size=, href=)
		const attrMatch = remaining.match(/^([a-zA-Z0-9_:-]+)(?=\s*=)/);
		if (attrMatch) {
			tokens.push({ text: attrMatch[1], type: 'attr-name' });
			remaining = remaining.slice(attrMatch[1].length);
			continue;
		}

		// 6. Equals sign
		if (remaining.startsWith('=')) {
			tokens.push({ text: '=', type: 'punctuation' });
			remaining = remaining.slice(1);
			continue;
		}

		// 7. Quoted attribute values / strings ("..." or '...')
		const strMatch = remaining.match(/^("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/);
		if (strMatch) {
			const str = strMatch[1];
			// Check if string contains inner merge variables like href="{{ invoice.url }}"
			if (str.includes('{{') && str.includes('}}')) {
				const innerParts = str.split(/(\{\{[^{}]*\}\})/g);
				for (const part of innerParts) {
					if (!part) continue;
					if (part.startsWith('{{') && part.endsWith('}}')) {
						tokens.push({ text: part, type: 'merge-var' });
					} else {
						tokens.push({ text: part, type: 'attr-value' });
					}
				}
			} else {
				tokens.push({ text: str, type: 'attr-value' });
			}
			remaining = remaining.slice(str.length);
			continue;
		}

		// 8. Plain text content between tags (e.g. Welcome to FrostMail)
		const plainMatch = remaining.match(/^[^<>{}"'=\s]+/);
		if (plainMatch) {
			tokens.push({ text: plainMatch[0], type: 'plain' });
			remaining = remaining.slice(plainMatch[0].length);
			continue;
		}

		// Fallback single character
		tokens.push({ text: remaining[0], type: 'plain' });
		remaining = remaining.slice(1);
	}

	return tokens;
}

/**
 * Tokenizes multi-line code into lines of tokens.
 */
export function tokenizeMarkup(code: string, _language: string = 'mjml'): Token[][] {
	if (!code) return [];
	const lines = code.split('\n');
	return lines.map((line) => tokenizeMjmlLine(line));
}
