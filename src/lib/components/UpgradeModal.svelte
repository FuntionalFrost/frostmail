<!-- src/lib/components/UpgradeModal.svelte -->
<script lang="ts">
	import { Modal, Button } from 'yaxa-svelte';
	import { CheckCircle2, ShieldCheck, Lock } from '@lucide/svelte';

	interface Props {
		open?: boolean;
		userEmail?: string;
	}

	let { open = $bindable(false), userEmail = '' }: Props = $props();

	let isCheckingOut = $state(false);
	let checkoutError = $state<string | null>(null);

	const features = [
		'Unlimited Cloud Template Sync & History',
		'Managed Cloudflare R2 / CDN Asset Storage',
		'Real-Time DNS & Deliverability Auditing',
		'1,000 Resend Inbox Test Dispatches / Month',
		'Full Multi-Format Exports (HTML, MJML, React Email .tsx)',
		'White-Label (Remove FrostMail Watermark)'
	];

	async function handleCheckout() {
		isCheckingOut = true;
		checkoutError = null;

		try {
			const res = await fetch('/api/polar/checkout', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					customerEmail: userEmail || undefined,
					successUrl: `${window.location.origin}/editor?upgrade=success`
				})
			});

			const data = (await res.json()) as { url?: string; message?: string };

			if (!res.ok) {
				checkoutError = data.message || 'Failed to start Polar checkout. Please check API key.';
				return;
			}

			if (data.url) {
				window.location.href = data.url;
			}
		} catch (err: unknown) {
			const e = err as Error;
			checkoutError = e.message || 'Failed to start Polar checkout.';
		} finally {
			isCheckingOut = false;
		}
	}
</script>

<Modal
	bind:open
	title="Upgrade to FrostMail Pro"
	description="Professional transactional email design, deliverability auditing, and cloud sync."
	size="md"
>
	<div class="space-y-4 text-sm">
		<!-- Monthly Pricing Banner -->
		<div
			class="border-primary-500 bg-primary-50/20 dark:bg-primary-950/20 space-y-1 rounded-xl border-2 p-4 text-center"
		>
			<div
				class="text-primary-600 dark:text-primary-400 text-xs font-bold tracking-wider uppercase"
			>
				Monthly Subscription
			</div>
			<div class="text-3xl font-black text-neutral-900 dark:text-neutral-100">
				€19<span class="text-sm font-normal text-neutral-400"> / month</span>
			</div>
			<div class="text-xs text-neutral-500">
				Cancel or pause anytime &bull; VAT handled automatically
			</div>
		</div>

		<!-- Features List -->
		<div class="space-y-2 py-1">
			{#each features as feat (feat)}
				<div class="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
					<CheckCircle2 class="text-primary-500 h-4.5 w-4.5 shrink-0" />
					<span>{feat}</span>
				</div>
			{/each}
		</div>

		{#if checkoutError}
			<p class="text-xs font-medium text-rose-500">{checkoutError}</p>
		{/if}

		<!-- Polar Actions -->
		<div class="space-y-2 pt-2">
			<Button block color="primary" size="lg" loading={isCheckingOut} onclick={handleCheckout}>
				<ShieldCheck class="mr-2 h-5 w-5" />
				Subscribe with Polar (€19 / mo)
			</Button>

			<div class="flex items-center justify-center gap-1.5 pt-1 text-xs text-neutral-400">
				<Lock class="h-3.5 w-3.5" />
				<span>Processed securely by Polar.sh &bull; Merchant of Record</span>
			</div>
		</div>
	</div>
</Modal>
