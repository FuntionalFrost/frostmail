// src/routes/api/diagnostic/dns/+server.ts
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export interface DnsCheckResult {
	domain: string;
	mx: { status: 'pass' | 'fail'; records: string[]; message: string };
	spf: { status: 'pass' | 'warn' | 'fail'; record: string | null; message: string };
	dmarc: { status: 'pass' | 'warn' | 'fail'; record: string | null; message: string };
	dkim: {
		status: 'pass' | 'warn' | 'fail';
		selector: string | null;
		record: string | null;
		message: string;
	};
	score: number;
}

interface DohAnswer {
	name: string;
	type: number;
	data: string;
}

interface DohResponse {
	Status: number;
	Answer?: DohAnswer[];
}

const COMMON_DKIM_SELECTORS = ['resend', 'google', 'k1', 's1', 'mail', 'smtp', 'default'];

async function queryDoh(name: string, type: 'TXT' | 'MX'): Promise<string[]> {
	try {
		const res = await fetch(
			`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(name)}&type=${type}`,
			{
				headers: { Accept: 'application/dns-json' }
			}
		);
		if (!res.ok) return [];
		const data = (await res.json()) as DohResponse;
		return (data.Answer || []).map((a) =>
			a.data.replace(/^"|"$/g, '').replace(/"\s*"/g, '').replace(/\\"/g, '"')
		);
	} catch {
		return [];
	}
}

export const POST: RequestHandler = async ({ request }) => {
	const body = (await request.json().catch(() => null)) as { domain?: string } | null;
	const domain = body?.domain
		?.trim()
		.toLowerCase()
		.replace(/^https?:\/\//, '')
		.split('/')[0];

	if (!domain || !domain.includes('.')) {
		throw error(400, 'Invalid domain name provided.');
	}

	const result: DnsCheckResult = {
		domain,
		mx: { status: 'fail', records: [], message: 'No MX records detected.' },
		spf: { status: 'fail', record: null, message: 'No SPF record detected.' },
		dmarc: { status: 'fail', record: null, message: 'No DMARC policy detected.' },
		dkim: {
			status: 'warn',
			selector: null,
			record: null,
			message: 'No common DKIM records detected.'
		},
		score: 0
	};

	// 1. Resolve MX Records
	const mxRecords = await queryDoh(domain, 'MX');
	if (mxRecords.length > 0) {
		result.mx = {
			status: 'pass',
			records: mxRecords,
			message: `Found ${mxRecords.length} MX record(s). Mail routing is active.`
		};
		result.score += 25;
	}

	// 2. Resolve SPF Record
	const txtRecords = await queryDoh(domain, 'TXT');
	const spfRecord = txtRecords.find((r) => r.startsWith('v=spf1'));
	if (spfRecord) {
		result.spf.record = spfRecord;
		if (spfRecord.includes('~all') || spfRecord.includes('-all')) {
			result.spf.status = 'pass';
			result.spf.message = 'Valid SPF record configured with enforcement.';
			result.score += 25;
		} else {
			result.spf.status = 'warn';
			result.spf.message = 'SPF record exists but uses neutral/permissive matching (?all or +all).';
			result.score += 15;
		}
	}

	// 3. Resolve DMARC Record
	const dmarcRecords = await queryDoh(`_dmarc.${domain}`, 'TXT');
	const dmarcRecord = dmarcRecords.find((r) => r.startsWith('v=DMARC1'));
	if (dmarcRecord) {
		result.dmarc.record = dmarcRecord;
		if (dmarcRecord.includes('p=reject') || dmarcRecord.includes('p=quarantine')) {
			result.dmarc.status = 'pass';
			result.dmarc.message = 'Strong DMARC policy active (quarantine/reject).';
			result.score += 25;
		} else {
			result.dmarc.status = 'warn';
			result.dmarc.message = 'DMARC policy is in monitoring mode (p=none).';
			result.score += 15;
		}
	}

	// 4. Probe DKIM Selectors
	const dkimQueries = COMMON_DKIM_SELECTORS.map(async (sel) => {
		const records = await queryDoh(`${sel}._domainkey.${domain}`, 'TXT');
		const dkimTxt = records.find((r) => r.includes('v=DKIM1') || r.includes('p='));
		return dkimTxt ? { selector: sel, record: dkimTxt } : null;
	});

	const dkimResults = await Promise.all(dkimQueries);
	const foundDkim = dkimResults.find(
		(res): res is { selector: string; record: string } => res !== null
	);

	if (foundDkim) {
		result.dkim = {
			status: 'pass',
			selector: foundDkim.selector,
			record: foundDkim.record,
			message: `Discovered active DKIM key under selector "${foundDkim.selector}".`
		};
		result.score += 25;
	}

	return json(result);
};
