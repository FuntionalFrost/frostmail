<!-- src/lib/components/SponsorModal.svelte -->
<script lang="ts">
	import { Modal, Button } from 'yaxa-svelte';
	import { Heart, CheckCircle2, Sparkles, ExternalLink, ShieldCheck } from '@lucide/svelte';
	import GithubIcon from '#lib/components/icons/GithubIcon.svelte';
	import { siteConfig } from '#lib/config/site.js';

	interface Props {
		open?: boolean;
	}

	let { open = $bindable(false) }: Props = $props();

	const freePerks = [
		'100% Free & Open Source (MIT License)',
		'Unlimited Local & Cloud Template Storage',
		'Full Multi-Format Exports (HTML, MJML, React Email .tsx, AST)',
		'Real-Time DNS & Deliverability Auditing',
		'Dynamic Merge Variable Simulation',
		'Zero Watermarks & Full White-Labeling'
	];
</script>

<Modal
	bind:open
	title="Support FrostMail"
	description="100% Free and Open Source Visual Transactional Email Studio."
	size="md"
>
	<div class="space-y-4 text-sm">
		<!-- Open Source Badge Banner -->
		<div
			class="space-y-2 rounded-xl border border-primary-500/30 bg-primary-50/50 p-5 text-center dark:bg-primary-950/30"
		>
			<div
				class="inline-flex items-center gap-1.5 rounded-full bg-primary-500/10 px-3 py-1 text-xs font-semibold text-primary-600 dark:text-primary-400"
			>
				<Sparkles class="h-3.5 w-3.5" />
				<span>MIT Licensed • Community Driven</span>
			</div>
			<div class="text-2xl font-black text-neutral-900 dark:text-neutral-100">Free Forever</div>
			<p class="text-xs text-neutral-600 dark:text-neutral-400">
				Every feature in FrostMail is unlocked for everyone. No paywalls, no vendor lock-in.
			</p>
		</div>

		<!-- Included Features -->
		<div class="space-y-2 py-1">
			{#each freePerks as perk (perk)}
				<div
					class="flex items-center gap-2.5 text-xs font-medium text-neutral-800 dark:text-neutral-200"
				>
					<CheckCircle2 class="h-4 w-4 shrink-0 text-emerald-500" />
					<span>{perk}</span>
				</div>
			{/each}
		</div>

		<!-- Action Buttons -->
		<div class="space-y-2.5 pt-2">
			<a
				href={siteConfig.socials?.github || 'https://github.com/FuntionalFrost'}
				target="_blank"
				rel="noopener noreferrer"
				class="block"
			>
				<Button block color="neutral" variant="solid" size="lg">
					<GithubIcon class="mr-2 h-4 w-4" />
					Star on GitHub
					<ExternalLink class="ml-auto h-3.5 w-3.5 opacity-60" />
				</Button>
			</a>

			<a href="https://polar.sh" target="_blank" rel="noopener noreferrer" class="block">
				<Button block color="primary" variant="subtle" size="lg">
					<Heart class="mr-2 h-4 w-4 text-rose-500" />
					Sponsor Development
					<ExternalLink class="ml-auto h-3.5 w-3.5 opacity-60" />
				</Button>
			</a>
		</div>

		<div
			class="flex items-center justify-center gap-1.5 pt-1 text-xs text-neutral-500 dark:text-neutral-400"
		>
			<ShieldCheck class="h-3.5 w-3.5" />
			<span>Self-hostable with Docker, Node, or SvelteKit adapters</span>
		</div>
	</div>
</Modal>
