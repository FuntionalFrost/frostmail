<!-- src/lib/components/DeliverabilityDrawer.svelte -->
<script lang="ts">
	import { studio } from '$lib/stores/studio.svelte';
	import { Popover, Badge } from 'yaxa-svelte';
	import { ShieldAlert, AlertTriangle, XCircle, Info, CheckCircle2 } from '@lucide/svelte';

	interface LintResult {
		score: number;
		flags: Array<{ type: 'error' | 'warning' | 'info'; message: string }>;
	}

	let lintResult = $state<LintResult>({ score: 100, flags: [] });
	let isValidating = $state(false);
	let lintTimer: ReturnType<typeof setTimeout> | null = null;

	async function checkContent() {
		if (!studio.compiledHtml) return;
		isValidating = true;
		try {
			const res = await fetch('/api/diagnostic/content', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					subject: studio.template.subject,
					html: studio.compiledHtml
				})
			});
			if (res.ok) {
				lintResult = (await res.json()) as LintResult;
			}
		} catch (e) {
			console.error('Lint scan failed', e);
		} finally {
			isValidating = false;
		}
	}

	$effect(() => {
		// Track dependencies
		const _sub = studio.template.subject;
		const _html = studio.compiledHtml;
		if (lintTimer) clearTimeout(lintTimer);
		lintTimer = setTimeout(() => {
			checkContent();
		}, 400);
	});
</script>

<Popover class="w-88 p-4">
	{#snippet trigger()}
		<span
			class="inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-sm font-semibold transition-colors cursor-pointer select-none {lintResult.score >= 80 && !studio.isClippedInGmail
				? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-800/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-950/70'
				: lintResult.score >= 50 && !studio.isClippedInGmail
					? 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:border-amber-800/80 dark:bg-amber-950/40 dark:text-amber-300 dark:hover:bg-amber-950/70'
					: 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:border-rose-800/80 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-950/70'}"
		>
			{#if isValidating}
				<span
					class="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
				></span>
			{:else}
				<ShieldAlert class="h-3.5 w-3.5" />
			{/if}
			<span>Spam: {lintResult.score}/100</span>
			<span class="opacity-50">&bull;</span>
			<span class="font-mono text-xs">{studio.emailSizeKb} KB</span>
		</span>
	{/snippet}

	<div class="space-y-3 text-sm">
		<div
			class="flex items-center justify-between border-b border-neutral-100 pb-2.5 dark:border-neutral-800"
		>
			<span class="text-base font-bold">Deliverability Audit</span>
			<Badge
				color={lintResult.score >= 80 && !studio.isClippedInGmail ? 'success' : lintResult.score >= 50 ? 'warning' : 'error'}
				size="sm"
			>
				{studio.isClippedInGmail
					? 'Gmail Clipped'
					: lintResult.score >= 80
						? 'Optimal'
						: lintResult.score >= 50
							? 'Moderate Risk'
							: 'High Spam Risk'}
			</Badge>
		</div>

		<!-- Size & Weight breakdown -->
		<div class="flex items-center justify-between rounded-md bg-neutral-50 px-3 py-2 text-xs dark:bg-neutral-800/60">
			<span class="text-neutral-600 dark:text-neutral-400">Email Size (Gmail 102 KB Limit):</span>
			<span class="font-mono font-semibold {studio.isClippedInGmail ? 'text-rose-600 dark:text-rose-400' : 'text-neutral-900 dark:text-neutral-100'}">
				{studio.emailSizeKb} KB
			</span>
		</div>

		{#if lintResult.flags.length === 0}
			<div class="flex items-center gap-2 py-2 text-sm text-emerald-600 dark:text-emerald-400">
				<CheckCircle2 class="h-4 w-4 shrink-0" />
				<span>No spam triggers or formatting risks detected.</span>
			</div>
		{:else}
			<div class="max-h-64 space-y-2 overflow-y-auto">
				{#each lintResult.flags as flag, idx (idx)}
					<div
						class="flex items-start gap-2 rounded border p-2.5 text-sm {flag.type === 'error'
							? 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300'
							: flag.type === 'warning'
								? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300'
								: 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900/50 dark:bg-sky-950/30 dark:text-sky-300'}"
					>
						{#if flag.type === 'error'}
							<XCircle class="mt-0.5 h-4 w-4 shrink-0" />
						{:else if flag.type === 'warning'}
							<AlertTriangle class="mt-0.5 h-4 w-4 shrink-0" />
						{:else}
							<Info class="mt-0.5 h-4 w-4 shrink-0" />
						{/if}
						<span class="leading-relaxed">{flag.message}</span>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</Popover>
