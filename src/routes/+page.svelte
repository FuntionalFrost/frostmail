<!-- src/routes/+page.svelte -->
<script lang="ts">
	import { Badge, Button, Seo } from 'yaxa-svelte';
	import ThemeToggle from '#lib/components/ThemeToggle.svelte';
	import SponsorModal from '#lib/components/SponsorModal.svelte';
	import ThemeModal from '#lib/components/ThemeModal.svelte';
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
		ExternalLink,
		Heart,
		Palette,
		HardDrive,
		Server
	} from '@lucide/svelte';
	import GithubIcon from '#lib/components/icons/GithubIcon.svelte';

	let isSponsorOpen = $state(false);
	let isThemeOpen = $state(false);

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

	import { siteConfig } from '#lib/config/site.js';
	import { generateOrganizationSchema, generateSoftwareApplicationSchema } from 'yaxa-svelte';
</script>

<Seo
	title="100% Free & Open Source Visual Transactional Email Studio & Deliverability Auditor"
	description="Design responsive MJML emails, preview dynamic merge variables, audit DNS authentication records, and dispatch test emails."
	ogImage={{
		title: 'FrostMail',
		description: 'Design bulletproof emails. 100% Free and Open Source.',
		badge: 'MIT Open Source'
	}}
	schema={[generateOrganizationSchema(siteConfig), generateSoftwareApplicationSchema(siteConfig)]}
/>

<div
	class="flex min-h-screen flex-col bg-neutral-50 text-neutral-900 transition-colors duration-200 dark:bg-neutral-950 dark:text-neutral-100"
>
	<!-- Navigation Bar -->
	<header
		class="sticky top-0 z-50 h-16 border-b border-neutral-200 bg-white/90 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-900/90"
	>
		<div class="mx-auto flex h-full max-w-6xl items-center justify-between px-6">
			<div class="flex items-center gap-3">
				<span class="text-lg font-extrabold tracking-tight">FrostMail</span>
				<Badge color="primary" variant="subtle" size="sm">MIT FOSS</Badge>
			</div>

			<div class="flex items-center gap-3">
				<ThemeToggle />
				<Button
					size="sm"
					color="neutral"
					variant="ghost"
					aria-label="Customize Theme"
					onclick={() => (isThemeOpen = true)}
				>
					<Palette class="h-4 w-4" />
				</Button>
				<a href="/diagnostic">
					<Button variant="ghost" color="neutral" size="sm">DNS Auditor</Button>
				</a>
				<Button color="neutral" variant="ghost" size="sm" onclick={() => (isSponsorOpen = true)}>
					<Heart class="mr-1.5 h-4 w-4 text-rose-500" />
					Sponsor
				</Button>
				<a href="https://github.com/FuntionalFrost/" target="_blank" rel="noopener noreferrer">
					<Button variant="outline" color="neutral" size="sm">
						<GithubIcon class="mr-1.5 h-4 w-4" />
						GitHub
					</Button>
				</a>
				<a href="/editor">
					<Button color="primary" size="sm">
						Launch Studio
						<ArrowRight class="ml-1.5 h-4 w-4" />
					</Button>
				</a>
			</div>
		</div>
	</header>

	<!-- Hero Section -->
	<main class="flex-1">
		<section class="relative mx-auto max-w-4xl space-y-6 px-6 pt-16 pb-12 text-center">
			<!-- Subtle Ambient Glow -->
			<div class="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
				<div
					class="h-[280px] w-[540px] rounded-full bg-primary-500/15 blur-[100px] dark:bg-primary-500/20"
				></div>
			</div>

			<div
				class="inline-flex items-center gap-2 rounded-full border border-primary-300 bg-primary-100/80 px-4 py-1.5 text-sm font-semibold text-primary-800 shadow-xs dark:border-primary-800 dark:bg-primary-950/80 dark:text-primary-300"
			>
				<Sparkles class="h-4 w-4" />
				<span>The Open Source Transactional Email Studio</span>
			</div>

			<h1 class="text-4xl leading-[1.15] font-black tracking-tight sm:text-5xl">
				Design bulletproof emails.<br />
				<span class="text-primary-500">Ensure primary inbox delivery.</span>
			</h1>

			<p
				class="mx-auto max-w-xl text-base leading-relaxed text-neutral-700 sm:text-lg dark:text-neutral-300"
			>
				FrostMail combines a visual MJML canvas with real-time spam scoring, dynamic JSON merge tag
				previews, and live DNS domain auditing.
			</p>

			<div class="flex items-center justify-center gap-3 pt-2">
				<a href="/editor">
					<Button size="md" color="primary">
						<Wrench class="mr-2 h-4.5 w-4.5" />
						Open Template Studio
					</Button>
				</a>
				<a href="/diagnostic">
					<Button size="md" color="neutral" variant="outline">
						<Search class="mr-2 h-4.5 w-4.5" />
						Audit Domain DNS
					</Button>
				</a>
			</div>
		</section>

		<!-- Interactive Studio Showcase Mockup -->
		<section class="mx-auto max-w-5xl px-6 pb-16">
			<div
				class="overflow-hidden rounded-2xl border border-neutral-300 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900"
			>
				<!-- Window Header Bar -->
				<div
					class="flex h-11 items-center justify-between border-b border-neutral-200 bg-neutral-100/90 px-4 dark:border-neutral-800 dark:bg-neutral-900/90"
				>
					<div class="flex items-center gap-2">
						<span class="inline-block h-3.5 w-3.5 rounded-full bg-red-400 dark:bg-red-500/80"
						></span>
						<span class="inline-block h-3.5 w-3.5 rounded-full bg-amber-400 dark:bg-amber-500/80"
						></span>
						<span
							class="inline-block h-3.5 w-3.5 rounded-full bg-emerald-400 dark:bg-emerald-500/80"
						></span>
						<span class="ml-2 font-mono text-sm font-medium text-neutral-600 dark:text-neutral-400"
							>frostmail-studio — order-receipt.mjml</span
						>
					</div>

					<div class="flex items-center gap-2 text-sm">
						<span
							class="rounded bg-primary-100 px-2.5 py-0.5 font-semibold text-primary-800 dark:bg-primary-950 dark:text-primary-300"
							>640px Desktop</span
						>
						<span
							class="rounded bg-emerald-100 px-2.5 py-0.5 font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
							>14.2 KB &bull; Safe in Gmail</span
						>
					</div>
				</div>

				<!-- Studio 3-Pane Visual Representation -->
				<div class="flex h-[400px] bg-neutral-100 dark:bg-neutral-950">
					<!-- Left Mini Sidebar -->
					<div
						class="hidden w-60 flex-col justify-between border-r border-neutral-200 bg-white p-3.5 md:flex dark:border-neutral-800 dark:bg-neutral-900"
					>
						<div class="space-y-3">
							<div
								class="text-sm font-bold tracking-wider text-neutral-600 uppercase dark:text-neutral-400"
							>
								Block Palette
							</div>
							<div class="space-y-2">
								{#each [{ icon: FileText, name: 'Text Block' }, { icon: MousePointerClick, name: 'Button CTA' }, { icon: ImageIcon, name: 'Product Image' }, { icon: MoveVertical, name: 'Vertical Spacer' }] as b (b.name)}
									<div
										class="flex items-center gap-2.5 rounded-lg border border-neutral-200 bg-neutral-50 p-2.5 text-sm font-medium text-neutral-800 dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-200"
									>
										<b.icon class="h-4.5 w-4.5 text-primary-500" />
										<span>{b.name}</span>
									</div>
								{/each}
							</div>
						</div>

						<div
							class="rounded-lg border border-primary-200 bg-primary-50 p-3 text-sm text-primary-800 dark:border-primary-900/60 dark:bg-primary-950/50 dark:text-primary-300"
						>
							<span class="font-bold">Drag & Drop Ready</span>
							<p class="mt-0.5 text-sm text-neutral-600 dark:text-neutral-400">
								Instant AST compilation
							</p>
						</div>
					</div>

					<!-- Center Simulated Canvas -->
					<div class="flex flex-1 items-center justify-center overflow-hidden p-6">
						<div
							class="w-full max-w-md space-y-4 rounded-xl border border-neutral-300 bg-white p-6 text-neutral-900 shadow-lg"
						>
							<div class="flex items-center justify-between border-b border-neutral-200 pb-3">
								<span class="text-base font-extrabold tracking-tight text-primary-600"
									>FrostMail Store</span
								>
								<span class="text-sm font-medium text-neutral-500">Order #48921</span>
							</div>

							<div class="space-y-1">
								<h3 class="text-lg font-black text-neutral-900">Payment Received</h3>
								<p class="text-sm text-neutral-600">
									Thank you, Alex Johnson. Your order is confirmed.
								</p>
							</div>

							<div
								class="space-y-2 rounded-lg border border-neutral-200 bg-neutral-50 p-3.5 text-sm"
							>
								<div class="flex justify-between font-medium text-neutral-800">
									<span>FrostMail Pro Plan</span>
									<span class="font-bold">€149.00</span>
								</div>
								<div
									class="flex justify-between border-t border-neutral-200 pt-1.5 text-sm text-neutral-600"
								>
									<span>VAT (Included)</span>
									<span>€0.00</span>
								</div>
							</div>

							<div class="pt-1 text-center">
								<span
									class="inline-block rounded-md bg-primary-600 px-5 py-2.5 text-sm font-bold text-white shadow-xs hover:bg-primary-700"
								>
									Download Invoice (PDF)
								</span>
							</div>
						</div>
					</div>

					<!-- Right Mini Inspector -->
					<div
						class="hidden w-60 flex-col justify-between border-l border-neutral-200 bg-white p-3.5 lg:flex dark:border-neutral-800 dark:bg-neutral-900"
					>
						<div class="space-y-3">
							<div
								class="text-sm font-bold tracking-wider text-neutral-600 uppercase dark:text-neutral-400"
							>
								Button Inspector
							</div>
							<div class="space-y-2.5 text-sm">
								<div>
									<span class="font-medium text-neutral-600 dark:text-neutral-400">Label</span>
									<div
										class="mt-1 truncate rounded border border-neutral-200 bg-neutral-50 p-2 font-mono text-sm text-neutral-800 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-200"
									>
										Download Invoice
									</div>
								</div>
								<div>
									<span class="font-medium text-neutral-600 dark:text-neutral-400">Color</span>
									<div class="mt-1 flex items-center gap-2">
										<span class="inline-block h-4.5 w-4.5 rounded bg-primary-500"></span>
										<span class="font-mono text-sm font-medium">#ff3e00</span>
									</div>
								</div>
								<div>
									<span class="font-medium text-neutral-600 dark:text-neutral-400">Alignment</span>
									<div class="mt-1 flex gap-1">
										<span
											class="rounded bg-primary-100 px-2.5 py-1 text-sm font-bold text-primary-800 dark:bg-primary-950 dark:text-primary-300"
											>Center</span
										>
									</div>
								</div>
							</div>
						</div>

						<a href="/editor" class="block w-full">
							<Button block size="sm" color="primary" variant="subtle">
								<ExternalLink class="mr-1.5 h-4 w-4" />
								Edit in Studio
							</Button>
						</a>
					</div>
				</div>
			</div>
		</section>

		<!-- Feature Grid -->
		<section
			class="mx-auto max-w-6xl border-t border-neutral-200 px-6 py-14 dark:border-neutral-800"
		>
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
				{#each features as feat (feat.title)}
					<div
						class="space-y-3 rounded-xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900"
					>
						<div
							class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-950 dark:text-primary-400"
						>
							<feat.icon class="h-5 w-5" />
						</div>
						<h3 class="text-base font-bold text-neutral-900 dark:text-neutral-100">{feat.title}</h3>
						<p class="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
							{feat.description}
						</p>
					</div>
				{/each}
			</div>
		</section>

		<!-- Open Source & Architecture Showcase Section -->
		<section
			class="mx-auto max-w-6xl border-t border-neutral-200 px-6 py-16 dark:border-neutral-800"
		>
			<div class="mx-auto mb-12 max-w-2xl space-y-3 text-center">
				<div
					class="inline-flex items-center gap-1.5 rounded-full bg-primary-500/10 px-3.5 py-1 text-xs font-bold text-primary-600 dark:text-primary-400"
				>
					<Sparkles class="h-3.5 w-3.5" />
					<span>100% Free & Open Source</span>
				</div>
				<h2 class="text-3xl font-extrabold tracking-tight sm:text-4xl">
					Freedom First. Zero Paywalls.
				</h2>
				<p class="text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
					Use the web studio directly in your browser with zero registration, or deploy your own
					self-hosted instance in minutes.
				</p>
			</div>

			<div class="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
				<!-- Zero Setup Studio -->
				<div
					class="flex flex-col justify-between space-y-6 rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
				>
					<div class="space-y-4">
						<div class="flex items-center justify-between">
							<div>
								<h3 class="text-xl font-bold text-neutral-900 dark:text-neutral-100">
									Local Studio
								</h3>
								<p class="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
									Instant browser-only mode, 100% private
								</p>
							</div>
							<div class="rounded-lg bg-neutral-100 p-2.5 dark:bg-neutral-800">
								<HardDrive class="h-5 w-5 text-neutral-700 dark:text-neutral-300" />
							</div>
						</div>

						<div class="flex items-baseline gap-1.5">
							<span class="text-4xl font-black text-neutral-900 dark:text-neutral-100">Free</span>
							<span class="text-sm font-medium text-neutral-500 dark:text-neutral-400"
								>/ MIT Licensed</span
							>
						</div>

						<div class="space-y-3 pt-2">
							{#each ['Zero registration or cloud account required', 'Local browser storage with 25-step Undo/Redo', 'Real-time MJML compilation & AST generation', 'Multi-format export (HTML, MJML, React Email .tsx)', 'Live DNS DoH deliverability auditing & scoring'] as feat (feat)}
								<div
									class="flex items-center gap-2.5 text-sm text-neutral-800 dark:text-neutral-200"
								>
									<Check class="h-5 w-5 shrink-0 text-primary-500" />
									<span>{feat}</span>
								</div>
							{/each}
						</div>
					</div>

					<a href="/editor" class="block w-full">
						<Button block size="lg" color="primary" variant="solid">Launch Studio Now</Button>
					</a>
				</div>

				<!-- Self-Hosted / Full Cloud -->
				<div
					class="relative flex flex-col justify-between space-y-6 rounded-2xl border-2 border-primary-500/40 bg-white p-8 shadow-lg dark:bg-neutral-900"
				>
					<div
						class="absolute -top-3.5 right-6 rounded-full bg-primary-600 px-3.5 py-1 text-xs font-bold text-white shadow-sm"
					>
						Self-Hostable
					</div>

					<div class="space-y-4">
						<div class="flex items-center justify-between">
							<div>
								<h3
									class="flex items-center gap-2 text-xl font-bold text-neutral-900 dark:text-neutral-100"
								>
									<span>Self-Hosted & BYOK</span>
								</h3>
								<p class="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
									For teams and production workflows
								</p>
							</div>
							<div class="rounded-lg bg-primary-100 p-2.5 dark:bg-primary-950">
								<Server class="h-5 w-5 text-primary-600 dark:text-primary-400" />
							</div>
						</div>

						<div class="flex items-baseline gap-2">
							<span class="text-4xl font-black text-neutral-900 dark:text-neutral-100">100%</span>
							<span class="text-sm font-medium text-neutral-500 dark:text-neutral-400"
								>Open Source</span
							>
						</div>

						<div class="space-y-3 pt-2">
							{#each ['Deploy with Docker, Netlify, Vercel, or Node', 'Encrypted PostgreSQL database sync (Neon/Local)', 'BYOK Resend API for 1-click test inbox delivery', 'Cloudflare R2 / AWS S3 media asset storage', 'Complete source code access with zero lock-in'] as feat (feat)}
								<div
									class="flex items-center gap-2.5 text-sm text-neutral-800 dark:text-neutral-200"
								>
									<CheckCircle2 class="h-5 w-5 shrink-0 text-primary-500" />
									<span>{feat}</span>
								</div>
							{/each}
						</div>
					</div>

					<div class="flex gap-2.5">
						<a
							href="https://github.com/FuntionalFrost/"
							target="_blank"
							rel="noopener noreferrer"
							class="flex-1"
						>
							<Button block size="lg" color="neutral" variant="outline">
								<GithubIcon class="mr-2 h-4 w-4" />
								GitHub
							</Button>
						</a>
						<Button
							size="lg"
							color="neutral"
							variant="subtle"
							onclick={() => (isSponsorOpen = true)}
						>
							<Heart class="h-4 w-4 text-rose-500" />
						</Button>
					</div>
				</div>
			</div>
		</section>
	</main>

	<!-- Footer -->
	<footer
		class="border-t border-neutral-200 py-8 text-sm text-neutral-600 dark:border-neutral-800 dark:text-neutral-400"
	>
		<div
			class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row"
		>
			<div class="flex items-center gap-2">
				<span class="font-bold text-neutral-900 dark:text-neutral-100">FrostMail</span>
				<span>&bull;</span>
				<span>MIT Licensed Open Source Software</span>
			</div>
			<div class="flex flex-wrap items-center justify-center gap-5 text-sm">
				<a href="/editor" class="hover:text-neutral-900 hover:underline dark:hover:text-white"
					>Studio</a
				>
				<a href="/diagnostic" class="hover:text-neutral-900 hover:underline dark:hover:text-white"
					>DNS Auditor</a
				>
				<a
					href="https://github.com/FuntionalFrost/"
					target="_blank"
					rel="noopener noreferrer"
					class="hover:text-neutral-900 hover:underline dark:hover:text-white">GitHub</a
				>
				<a href="/privacy" class="hover:text-neutral-900 hover:underline dark:hover:text-white"
					>Privacy</a
				>
				<a href="/terms" class="hover:text-neutral-900 hover:underline dark:hover:text-white"
					>Terms</a
				>
				<a href="/refunds" class="hover:text-neutral-900 hover:underline dark:hover:text-white"
					>Refunds</a
				>
				<a href="/impressum" class="hover:text-neutral-900 hover:underline dark:hover:text-white"
					>Impressum</a
				>
			</div>
		</div>
	</footer>

	<!-- Modals -->
	<SponsorModal bind:open={isSponsorOpen} />
	<ThemeModal bind:open={isThemeOpen} />
</div>
