<!-- src/routes/diagnostic/+page.svelte -->
<script lang="ts">
	import { Button, Badge, Input, Seo } from 'yaxa-svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import { Wrench, Globe, Search, Check, Copy } from '@lucide/svelte';

	interface DnsCheckResult {
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

	let domainInput = $state('');
	let isScanning = $state(false);
	let scanError = $state<string | null>(null);
	let scanResult = $state<DnsCheckResult | null>(null);
	let isCopied = $state(false);

	const sampleDomains = ['resend.com', 'stripe.com', 'github.com', 'google.com', 'postmarkapp.com'];

	async function runDiagnostic() {
		const cleanDomain =
			domainInput
				.trim()
				.replace(/^https?:\/\//, '')
				.split('/')[0] || '';

		if (!cleanDomain) {
			scanError = 'Please enter a valid domain name.';
			return;
		}

		scanError = null;
		isScanning = true;
		scanResult = null;

		try {
			const res = await fetch('/api/diagnostic/dns', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ domain: cleanDomain })
			});

			const data = (await res.json()) as DnsCheckResult & { message?: string };

			if (!res.ok) {
				scanError = data.message || 'Failed to inspect domain DNS records.';
				return;
			}

			scanResult = data;
		} catch (err: unknown) {
			const e = err as Error;
			scanError = e.message || 'Failed to inspect domain DNS records.';
		} finally {
			isScanning = false;
		}
	}

	function selectSampleDomain(domain: string) {
		domainInput = domain;
		runDiagnostic();
	}

	async function copyAuditReport() {
		if (!scanResult) return;
		const text = `FrostMail Deliverability Audit Report for ${scanResult.domain}:
• Deliverability Score: ${scanResult.score}/100
• MX Routing: ${scanResult.mx.status.toUpperCase()} - ${scanResult.mx.message}
• SPF Alignment: ${scanResult.spf.status.toUpperCase()} - ${scanResult.spf.message}
• DKIM Signatures: ${scanResult.dkim.status.toUpperCase()} - ${scanResult.dkim.message}
• DMARC Policy: ${scanResult.dmarc.status.toUpperCase()} - ${scanResult.dmarc.message}

Audited with FrostMail: https://frostmail.dev/diagnostic`;

		try {
			await navigator.clipboard.writeText(text);
			isCopied = true;
			setTimeout(() => {
				isCopied = false;
			}, 2000);
		} catch (err) {
			console.error('Failed to copy report:', err);
		}
	}

	function getBadgeColor(status: 'pass' | 'warn' | 'fail'): 'success' | 'warning' | 'error' {
		if (status === 'pass') return 'success';
		if (status === 'warn') return 'warning';
		return 'error';
	}
</script>

<Seo
	title="DNS & Deliverability Auditor"
	description="Scan your domain's SPF, DKIM, DMARC, and MX records in real time using Cloudflare DNS-over-HTTPS."
	ogImage={{
		title: 'Domain Deliverability Auditor',
		description: 'Real-time SPF, DKIM, DMARC & MX validator.',
		badge: 'DNS Auditor'
	}}
/>

<div
	class="flex min-h-screen flex-col bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100"
>
	<header
		class="flex h-14 items-center justify-between border-b border-neutral-200 bg-white px-6 dark:border-neutral-800 dark:bg-neutral-900"
	>
		<div class="flex items-center gap-3">
			<a href="/" class="text-base font-bold tracking-tight hover:opacity-80"> FrostMail </a>
			<span class="bg-primary-500/10 text-primary-500 rounded px-2.5 py-0.5 text-sm font-medium">
				DNS Auditor
			</span>
		</div>
		<div class="flex items-center gap-2">
			<ThemeToggle />
			<a href="/editor">
				<Button size="sm" variant="outline" color="neutral">
					<Wrench class="mr-1.5 h-3.5 w-3.5" />
					Open Email Studio
				</Button>
			</a>
		</div>
	</header>

	<main class="mx-auto flex w-full max-w-5xl flex-1 flex-col space-y-8 p-6 md:py-12">
		<div class="space-y-3 text-center">
			<h1 class="text-3xl font-extrabold tracking-tight sm:text-4xl">
				Domain Deliverability Auditor
			</h1>
			<p class="mx-auto max-w-lg text-base text-neutral-500 dark:text-neutral-400">
				Scan your domain's SPF, DKIM, DMARC, and MX records in real time using Cloudflare
				DNS-over-HTTPS.
			</p>

			<form
				class="mx-auto flex max-w-md gap-2 pt-4"
				onsubmit={(e) => {
					e.preventDefault();
					runDiagnostic();
				}}
			>
				<Input bind:value={domainInput} placeholder="e.g. yourcompany.com" size="md" class="flex-1">
					{#snippet leading()}
						<Globe class="h-4 w-4" />
					{/snippet}
				</Input>
				<Button type="submit" color="primary" size="md" loading={isScanning}>
					<Search class="mr-1.5 h-4 w-4" />
					Audit Domain
				</Button>
			</form>

			<!-- Quick 1-Click Domain Chips -->
			<div class="flex flex-wrap items-center justify-center gap-1.5 pt-2">
				<span class="mr-1 text-xs text-neutral-400">Try example:</span>
				{#each sampleDomains as domain (domain)}
					<Button
						size="xs"
						color="neutral"
						variant="subtle"
						onclick={() => selectSampleDomain(domain)}
					>
						{domain}
					</Button>
				{/each}
			</div>

			{#if scanError}
				<p class="pt-1 text-sm font-medium text-rose-500">{scanError}</p>
			{/if}
		</div>

		{#if scanResult}
			<div class="space-y-6">
				<div
					class="flex flex-col justify-between gap-4 rounded-xl border border-neutral-200 bg-white p-6 shadow-xs sm:flex-row sm:items-center dark:border-neutral-800 dark:bg-neutral-900"
				>
					<div>
						<div class="text-sm font-medium tracking-wider text-neutral-500 uppercase">
							Audit Target
						</div>
						<div class="mt-0.5 text-2xl font-bold tracking-tight">
							{scanResult.domain}
						</div>
					</div>
					<div class="flex items-center gap-6">
						<Button size="sm" color="neutral" variant="outline" onclick={copyAuditReport}>
							{#if isCopied}
								<Check class="mr-1.5 h-3.5 w-3.5" />
								Report Copied!
							{:else}
								<Copy class="mr-1.5 h-3.5 w-3.5" />
								Copy Report
							{/if}
						</Button>
						<div class="text-right">
							<div class="text-sm font-medium tracking-wider text-neutral-500 uppercase">
								Deliverability Score
							</div>
							<div
								class="mt-0.5 text-4xl font-black {scanResult.score >= 80
									? 'text-emerald-500'
									: scanResult.score >= 50
										? 'text-amber-500'
										: 'text-rose-500'}"
							>
								{scanResult.score} / 100
							</div>
						</div>
					</div>
				</div>

				<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
					<!-- MX -->
					<div
						class="space-y-2 rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"
					>
						<div class="flex items-center justify-between">
							<span class="text-base font-semibold">MX Routing</span>
							<Badge color={getBadgeColor(scanResult.mx.status)} size="sm" variant="subtle">
								{scanResult.mx.status.toUpperCase()}
							</Badge>
						</div>
						<p class="text-sm leading-relaxed text-neutral-500">
							{scanResult.mx.message}
						</p>
					</div>

					<!-- SPF -->
					<div
						class="space-y-2 rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"
					>
						<div class="flex items-center justify-between">
							<span class="text-base font-semibold">SPF Alignment</span>
							<Badge color={getBadgeColor(scanResult.spf.status)} size="sm" variant="subtle">
								{scanResult.spf.status.toUpperCase()}
							</Badge>
						</div>
						<p class="text-sm leading-relaxed text-neutral-500">
							{scanResult.spf.message}
						</p>
					</div>

					<!-- DKIM -->
					<div
						class="space-y-2 rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"
					>
						<div class="flex items-center justify-between">
							<span class="text-base font-semibold">DKIM Signatures</span>
							<Badge color={getBadgeColor(scanResult.dkim.status)} size="sm" variant="subtle">
								{scanResult.dkim.status.toUpperCase()}
							</Badge>
						</div>
						<p class="text-sm leading-relaxed text-neutral-500">
							{scanResult.dkim.message}
						</p>
					</div>

					<!-- DMARC -->
					<div
						class="space-y-2 rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"
					>
						<div class="flex items-center justify-between">
							<span class="text-base font-semibold">DMARC Policy</span>
							<Badge color={getBadgeColor(scanResult.dmarc.status)} size="sm" variant="subtle">
								{scanResult.dmarc.status.toUpperCase()}
							</Badge>
						</div>
						<p class="text-sm leading-relaxed text-neutral-500">
							{scanResult.dmarc.message}
						</p>
					</div>
				</div>
			</div>
		{/if}
	</main>
</div>
