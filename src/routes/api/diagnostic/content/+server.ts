// src/routes/api/diagnostic/content/+server.ts
import type { RequestHandler } from './$types';

export interface ContentLintResult {
	score: number;
	flags: Array<{ type: 'error' | 'warning' | 'info'; message: string }>;
}

const SPAM_KEYWORDS = [
	'100% free',
	'act now',
	'buy direct',
	'guaranteed',
	'make money fast',
	'risk-free',
	'winner',
	'urgent',
	'no catch'
];

export const POST: RequestHandler = async ({ request }) => {
	const body = (await request.json().catch(() => null)) as {
		subject?: string;
		html?: string;
	} | null;
	const subject = body?.subject || '';
	const html = body?.html || '';

	const flags: ContentLintResult['flags'] = [];
	let score = 100;

	// 1. Check Subject Line
	if (!subject.trim()) {
		flags.push({ type: 'error', message: 'Subject line is empty.' });
		score -= 30;
	} else {
		// Only flag if subject contains actual alphabet characters AND all are uppercase
		const hasLetters = /[a-zA-Z]/.test(subject);
		if (hasLetters && subject === subject.toUpperCase() && subject.length > 5) {
			flags.push({ type: 'error', message: 'Subject line is entirely in ALL CAPS.' });
			score -= 20;
		}
		if (/[!?]{2,}/.test(subject)) {
			flags.push({
				type: 'warning',
				message: 'Excessive punctuation in subject line (e.g. "!!", "??").'
			});
			score -= 10;
		}
	}

	// 2. Scan Spam Keywords in Subject & Body
	const fullText = `${subject} ${html.replace(/<[^>]*>/g, ' ')}`.toLowerCase();
	for (const keyword of SPAM_KEYWORDS) {
		if (fullText.includes(keyword)) {
			flags.push({ type: 'warning', message: `Found high-risk spam keyword: "${keyword}".` });
			score -= 10;
		}
	}

	// 3. Unsubscribe Token Check
	const hasUnsubscribe = fullText.includes('unsubscribe') || fullText.includes('opt-out');
	if (!hasUnsubscribe) {
		flags.push({
			type: 'info',
			message: 'No standard unsubscribe link detected in template body.'
		});
		score -= 10;
	}

	const result: ContentLintResult = {
		score: Math.max(score, 0),
		flags
	};

	return Response.json(result);
};
