<!-- src/routes/+page.svelte -->
<script lang="ts">
	import { Badge, Button, Seo } from 'yaxa-svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import UpgradeModal from '$lib/components/UpgradeModal.svelte';
	import {
		Sparkles,
		ArrowRight,
		Wrench,
		Search,
		Check,
		CheckCircle2,
		Code2,
		ShieldCheck,
		Variable,
		Send,
		FileText,
		MousePointerClick,
		Image as ImageIcon,
		MoveVertical,
		ExternalLink
	} from '@lucide/svelte';

	let isUpgradeOpen = $state(false);

	const features = [
		{
			icon: Code2,
			title: 'AST-Powered MJML Engine',
			description:
				'Generates responsive, multi-client HTML guaranteed to render accurately on Outlook, Gmail, and Apple Mail.'
		},
		{
			icon: ShieldCheck,
			title: 'DNS & Deliverability Auditor',
			description:
				'Audit SPF, DMARC, and MX records in seconds to guarantee direct primary inbox placement.'
		},
		{
			icon: Variable,
			title: 'Dynamic Merge Variables',
			description:
				'Simulate live JSON payloads and mock template variables directly within the live preview canvas.'
		},
		{
			icon: Send,
			title: 'Instant Resend API Dispatch',
			description:
				'Send test emails straight to your inbox with a single click using integrated Resend dispatch.'
		}
	];

	const proFeatures = [
		'Unlimited Cloud Sync & Database Storage',
		'Automated 24/7 Domain DNS Monitoring',
		'1,000 High-Reputation Dispatches / Month',
		'Full React Email (.tsx) & AST Exports',
		'White-Label (Remove FrostMail branding)',
		'Commercial Merchant of Record via Polar.sh'
	];
</script>

<Seo
	title="Open Source Visual Transactional Email Studio & Deliverability Auditor"
	description="Design responsive MJML emails, preview dynamic merge variables, audit DNS authentication records, and dispatch test emails."
	ogImage={{
		title: 'FrostMail',
		description: 'Design bulletproof emails. Ensure primary inbox delivery.',
		badge: 'Open Source Email Studio'
	}}
/>

<div
	class="flex min-h-screen flex-col bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100"
>
	<!-- Navigation Bar -->
	<header
		class="sticky top-0 z-50 h-14 border-b border-neutral-200 bg-white/80 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/80"
	>
		<div class="mx-auto flex h-full max-w-6xl items-center justify-between px-6">
			<div class="flex items-center gap-2.5">
				<span class="text-base font-extrabold tracking-tight">FrostMail</span>
				<Badge color="primary" variant="subtle" size="sm">v1.0</Badge>
			</div>

			<div class="flex items-center gap-2.5">
				<ThemeToggle />
				<a href="/diagnostic">
					<Button variant="ghost" color="neutral" size="sm">DNS Auditor</Button>
				</a>
				<Button color="primary" variant="subtle" size="sm" onclick={() => (isUpgradeOpen = true)}>
					<Sparkles class="mr-1.5 h-3.5 w-3.5" />
					Pricing (€)
				</Button>
				<a href="/editor">
					<Button color="primary" size="sm">
						Launch Editor
						<ArrowRight class="ml-1.5 h-3.5 w-3.5" />
					</Button>
				</a>
			</div>
		</div>
	</header>

	<!-- Hero Section -->
	<main class="flex-1">
		<section class="relative mx-auto max-w-4xl space-y-5 px-6 pt-16 pb-12 text-center">
			<!-- Subtle Ambient Glow -->
			<div class="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
				<div
					class="bg-primary-500/10 dark:bg-primary-500/15 h-[260px] w-[500px] rounded-full blur-[100px]"
				></div>
			</div>

			<div
				class="border-primary-200 bg-primary-50 text-primary-600 dark:border-primary-900 dark:bg-primary-950/60 dark:text-primary-400 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-semibold"
			>
				<Sparkles class="h-4 w-4" />
				<span>The Open Source Transactional Email Studio</span>
			</div>

			<h1 class="text-4xl leading-[1.15] font-black tracking-tight sm:text-5xl">
				Design bulletproof emails.<br />
				<span class="text-primary-500">Ensure primary inbox delivery.</span>
			</h1>

			<p
				class="mx-auto max-w-xl text-base leading-relaxed text-neutral-600 sm:text-lg dark:text-neutral-400"
			>
				FrostMail combines a visual MJML canvas with real-time spam scoring, dynamic JSON merge tag
				previews, and live DNS domain auditing.
			</p>

			<div class="flex items-center justify-center gap-3 pt-2">
				<a href="/editor">
					<Button size="md" color="primary">
						<Wrench class="mr-2 h-4 w-4" />
						Open Template Studio
					</Button>
				</a>
				<a href="/diagnostic">
					<Button size="md" color="neutral" variant="outline">
						<Search class="mr-2 h-4 w-4" />
						Audit Domain DNS
					</Button>
				</a>
			</div>
		</section>

		<!-- Interactive Studio Showcase Mockup -->
		<section class="mx-auto max-w-5xl px-6 pb-16">
			<div
				class="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900"
			>
				<!-- Window Header Bar -->
				<div
					class="flex h-10 items-center justify-between border-b border-neutral-200 bg-neutral-50/80 px-4 dark:border-neutral-800 dark:bg-neutral-900/80"
				>
					<div class="flex items-center gap-2">
						<span class="inline-block h-3 w-3 rounded-full bg-red-400 dark:bg-red-500/80"></span>
						<span class="inline-block h-3 w-3 rounded-full bg-amber-400 dark:bg-amber-500/80"
						></span>
						<span class="inline-block h-3 w-3 rounded-full bg-emerald-400 dark:bg-emerald-500/80"
						></span>
						<span class="ml-2 font-mono text-xs text-neutral-400"
							>frostmail-studio — order-receipt.mjml</span
						>
					</div>

					<div class="flex items-center gap-2 text-xs">
						<span
							class="bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-400 rounded px-2 py-0.5 font-medium"
							>640px Desktop</span
						>
						<span
							class="rounded bg-emerald-50 px-2 py-0.5 font-medium text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
							>14.2 KB &bull; Safe in Gmail</span
						>
					</div>
				</div>

				<!-- Studio 3-Pane Visual Representation -->
				<div class="flex h-[380px] bg-neutral-100 dark:bg-neutral-950">
					<!-- Left Mini Sidebar -->
					<div
						class="hidden w-56 flex-col justify-between border-r border-neutral-200 bg-white p-3 md:flex dark:border-neutral-800 dark:bg-neutral-900"
					>
						<div class="space-y-3">
							<div class="text-xs font-bold tracking-wider text-neutral-400 uppercase">
								Block Palette
							</div>
							<div class="space-y-1.5">
								{#each [{ icon: FileText, name: 'Text Block' }, { icon: MousePointerClick, name: 'Button CTA' }, { icon: ImageIcon, name: 'Product Image' }, { icon: MoveVertical, name: 'Vertical Spacer' }] as b (b.name)}
									<div
										class="flex items-center gap-2 rounded-lg border border-neutral-100 bg-neutral-50/50 p-2 text-xs font-medium dark:border-neutral-800 dark:bg-neutral-900/50"
									>
										<b.icon class="text-primary-500 h-4 w-4" />
										<span>{b.name}</span>
									</div>
								{/each}
							</div>
						</div>

						<div
							class="border-primary-100 bg-primary-50/60 text-primary-700 dark:border-primary-900/50 dark:bg-primary-950/40 dark:text-primary-300 rounded-lg border p-2.5 text-xs"
						>
							<span class="font-semibold">Drag & Drop Ready</span>
							<p class="mt-0.5 text-[11px] text-neutral-500 dark:text-neutral-400">
								Instant AST compilation
							</p>
						</div>
					</div>

					<!-- Center Simulated Canvas -->
					<div class="flex flex-1 items-center justify-center overflow-hidden p-6">
						<div
							class="w-full max-w-md space-y-4 rounded-xl border border-neutral-200/80 bg-white p-6 text-neutral-900 shadow-lg"
						>
							<div class="flex items-center justify-between border-b border-neutral-100 pb-3">
								<span class="text-primary-600 text-base font-extrabold tracking-tight"
									>FrostMail Store</span
								>
								<span class="text-xs text-neutral-400">Order #48921</span>
							</div>

							<div class="space-y-1">
								<h3 class="text-lg font-black text-neutral-900">Payment Received</h3>
								<p class="text-xs text-neutral-500">
									Thank you, Alex Johnson. Your order is confirmed.
								</p>
							</div>

							<div
								class="space-y-1.5 rounded-lg border border-neutral-100 bg-neutral-50 p-3 text-xs"
							>
								<div class="flex justify-between font-medium">
									<span>FrostMail Pro Plan</span>
									<span class="font-bold">€149.00</span>
								</div>
								<div
									class="flex justify-between border-t border-neutral-200 pt-1 text-[11px] text-neutral-400"
								>
									<span>VAT (Included)</span>
									<span>€0.00</span>
								</div>
							</div>

							<div class="pt-1 text-center">
								<span
									class="bg-primary-500 inline-block rounded-md px-5 py-2 text-xs font-bold text-white shadow-xs"
								>
									Download Invoice (PDF)
								</span>
							</div>
						</div>
					</div>

					<!-- Right Mini Inspector -->
					<div
						class="hidden w-56 flex-col justify-between border-l border-neutral-200 bg-white p-3 lg:flex dark:border-neutral-800 dark:bg-neutral-900"
					>
						<div class="space-y-3">
							<div class="text-xs font-bold tracking-wider text-neutral-400 uppercase">
								Button Inspector
							</div>
							<div class="space-y-2 text-xs">
								<div>
									<span class="text-neutral-400">Label</span>
									<div
										class="mt-0.5 truncate rounded border border-neutral-200 bg-neutral-50 p-1.5 font-mono dark:border-neutral-800 dark:bg-neutral-800"
									>
										Download Invoice
									</div>
								</div>
								<div>
									<span class="text-neutral-400">Color</span>
									<div class="mt-0.5 flex items-center gap-1.5">
										<span class="bg-primary-500 inline-block h-4 w-4 rounded"></span>
										<span class="font-mono">#0284c7</span>
									</div>
								</div>
								<div>
									<span class="text-neutral-400">Alignment</span>
									<div class="mt-0.5 flex gap-1">
										<span
											class="bg-primary-50 text-primary-500 dark:bg-primary-950 rounded px-2 py-0.5 font-bold"
											>Center</span
										>
									</div>
								</div>
							</div>
						</div>

						<a href="/editor" class="block w-full">
							<Button block size="xs" color="primary" variant="subtle">
								<ExternalLink class="mr-1.5 h-3.5 w-3.5" />
								Edit in Studio
							</Button>
						</a>
					</div>
				</div>
			</div>
		</section>

		<!-- Feature Grid -->
		<section
			class="mx-auto max-w-6xl border-t border-neutral-200 px-6 py-12 dark:border-neutral-800"
		>
			<div class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
				{#each features as feat (feat.title)}
					<div
						class="space-y-2.5 rounded-xl border border-neutral-200 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900"
					>
						<div
							class="bg-primary-50 text-primary-500 dark:bg-primary-950 flex h-9 w-9 items-center justify-center rounded-lg"
						>
							<feat.icon class="h-5 w-5" />
						</div>
						<h3 class="text-base font-bold">{feat.title}</h3>
						<p class="text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
							{feat.description}
						</p>
					</div>
				{/each}
			</div>
		</section>

		<!-- Pricing Section in Euro (€) -->
		<section
			class="mx-auto max-w-6xl border-t border-neutral-200 px-6 py-16 dark:border-neutral-800"
		>
			<div class="mx-auto mb-12 max-w-2xl space-y-3 text-center">
				<h2 class="text-3xl font-extrabold tracking-tight">
					Transparent, Developer-Friendly Pricing
				</h2>
				<p class="text-base text-neutral-600 dark:text-neutral-400">
					Start completely free in your browser. Upgrade whenever you need cloud synchronization and
					automated deliverability monitoring.
				</p>
			</div>

			<div class="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
				<!-- Community Free Tier -->
				<div
					class="flex flex-col justify-between space-y-6 rounded-2xl border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-900"
				>
					<div class="space-y-4">
						<div>
							<h3 class="text-xl font-bold">Community</h3>
							<p class="mt-1 text-sm text-neutral-500">For independent hackers and developers</p>
						</div>

						<div class="flex items-baseline gap-1">
							<span class="text-4xl font-black">€0</span>
							<span class="text-sm text-neutral-500">/ free forever</span>
						</div>

						<div class="space-y-2.5 pt-2">
							{#each ['Visual AST & MJML Canvas Editor', 'LocalStorage Persistence & 25-step Undo/Redo', 'Live Deliverability & DNS-over-HTTPS Auditor', 'HTML, MJML & React Email (.tsx) Exports', 'Dynamic JSON Payload Simulation'] as feat (feat)}
								<div
									class="flex items-center gap-2.5 text-sm text-neutral-700 dark:text-neutral-300"
								>
									<Check class="text-primary-500 h-4.5 w-4.5 shrink-0" />
									<span>{feat}</span>
								</div>
							{/each}
						</div>
					</div>

					<a href="/editor" class="block w-full">
						<Button block size="lg" color="neutral" variant="outline">Launch Free Studio</Button>
					</a>
				</div>

				<!-- Pro Tier -->
				<div
					class="border-primary-500 shadow-primary-500/5 relative flex flex-col justify-between space-y-6 rounded-2xl border-2 bg-white p-8 shadow-lg dark:bg-neutral-900"
				>
					<div
						class="bg-primary-500 absolute -top-3 right-6 rounded-full px-3 py-1 text-xs font-bold text-white shadow-xs"
					>
						Merchant of Record: Polar.sh
					</div>

					<div class="space-y-4">
						<div>
							<h3 class="flex items-center gap-2 text-xl font-bold">
								<span>FrostMail Pro</span>
								<Sparkles class="text-primary-500 h-4 w-4" />
							</h3>
							<p class="mt-1 text-sm text-neutral-500">
								For production teams and high-deliverability senders
							</p>
						</div>

						<div class="flex items-baseline gap-2">
							<span class="text-4xl font-black">€19</span>
							<span class="text-sm text-neutral-500">/ month</span>
						</div>

						<div class="space-y-2.5 pt-2">
							{#each proFeatures as feat (feat)}
								<div
									class="flex items-center gap-2.5 text-sm text-neutral-700 dark:text-neutral-300"
								>
									<CheckCircle2 class="text-primary-500 h-4.5 w-4.5 shrink-0" />
									<span>{feat}</span>
								</div>
							{/each}
						</div>
					</div>

					<Button block size="lg" color="primary" onclick={() => (isUpgradeOpen = true)}>
						<ShieldCheck class="mr-2 h-5 w-5" />
						Subscribe to Pro (€19 / mo)
					</Button>
				</div>
			</div>
		</section>
	</main>

	<!-- Footer -->
	<footer class="border-t border-neutral-200 py-6 text-sm text-neutral-500 dark:border-neutral-800">
		<div class="mx-auto flex max-w-6xl items-center justify-between px-6">
			<span>FrostMail &bull; Built with SvelteKit & yaxa-svelte</span>
			<div class="flex gap-4">
				<a href="/editor" class="hover:underline">Editor</a>
				<a href="/diagnostic" class="hover:underline">Diagnostic</a>
			</div>
		</div>
	</footer>

	<!-- Upgrade Modal -->
	<UpgradeModal bind:open={isUpgradeOpen} />
</div>
