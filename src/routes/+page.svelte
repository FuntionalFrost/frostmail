<!-- src/routes/+page.svelte -->
<script lang="ts">
	import { Badge, Button, Seo } from 'yaxa-svelte';
	import ThemeToggle from '#lib/components/ThemeToggle.svelte';
	import SponsorModal from '#lib/components/SponsorModal.svelte';
	import ThemeModal from '#lib/components/ThemeModal.svelte';
	import {
		Sparkles,
		ArrowRight,
		Search,
		Check,
		CheckCircle2,
		ShieldCheck,
		Variable,
		Send,
		ExternalLink,
		Palette,
		HardDrive,
		Server,
		Code,
		Layers,
		Zap,
		Inbox,
		Terminal,
		Cpu,
		Copy,
		Check as CheckIcon
	} from '@lucide/svelte';
	import GithubIcon from '#lib/components/icons/GithubIcon.svelte';
	import { siteConfig } from '#lib/config/site.js';
	import { generateOrganizationSchema, generateSoftwareApplicationSchema } from 'yaxa-svelte';

	let isSponsorOpen = $state(false);
	let isThemeOpen = $state(false);
	let copiedSnippet = $state(false);

	let previewPreset = $state<'receipt' | 'welcome' | 'newsletter'>('receipt');

	const presetsData = {
		receipt: {
			file: 'order-receipt.mjml',
			title: 'Order Receipt #8492',
			badge: 'Transaction Confirmed',
			subject: 'Your FrostMail order #8492 has shipped',
			previewHtml: `
				<div class="space-y-3 text-neutral-800">
					<div class="flex items-center justify-between border-b border-neutral-200 pb-2.5">
						<span class="font-extrabold text-primary-600">FrostMail Store</span>
						<span class="font-mono text-xs text-neutral-500">Order #8492</span>
					</div>
					<div class="text-sm font-semibold text-neutral-900">Payment Received — €149.00</div>
					<div class="rounded-lg bg-neutral-50 p-2.5 text-xs space-y-1.5 border border-neutral-200/80">
						<div class="flex justify-between"><span>FrostMail Pro (Annual)</span><span class="font-semibold">€149.00</span></div>
						<div class="flex justify-between text-neutral-500"><span>VAT (Included)</span><span>€0.00</span></div>
					</div>
					<div class="pt-1 text-center">
						<span class="inline-block rounded-md bg-primary-600 px-4 py-2 text-xs font-bold text-white shadow-xs">Download Invoice (PDF)</span>
					</div>
				</div>
			`,
			mjmlCode: `<mjml>
  <mj-body background-color="#f8fafc">
    <mj-section background-color="#ffffff" border-radius="12px">
      <mj-column>
        <mj-text font-size="20px" font-weight="bold">Payment Received</mj-text>
        <mj-text color="#64748b">Order #{{ order.id }} confirmed for {{ user.name }}</mj-text>
        <mj-button background-color="#ff3e00" href="{{ invoice.url }}">Download Invoice</mj-button>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`
		},
		welcome: {
			file: 'welcome-onboarding.mjml',
			title: 'Welcome to FrostMail',
			badge: 'New User Onboarding',
			subject: 'Welcome aboard! Let’s get you started',
			previewHtml: `
				<div class="space-y-3 text-neutral-800 text-center">
					<div class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-600 font-black">✉</div>
					<h3 class="text-base font-bold text-neutral-900">Welcome to FrostMail</h3>
					<p class="text-xs text-neutral-600 leading-relaxed">Your account is ready. Build responsive, bulletproof transactional emails with zero lock-in.</p>
					<div class="pt-2">
						<span class="inline-block rounded-md bg-primary-600 px-4 py-2 text-xs font-bold text-white shadow-xs">Start Designing Now</span>
					</div>
				</div>
			`,
			mjmlCode: `<mjml>
  <mj-body background-color="#f8fafc">
    <mj-section background-color="#ffffff">
      <mj-column>
        <mj-text font-size="22px" font-weight="800">Welcome to FrostMail</mj-text>
        <mj-text color="#475569">Hi {{ user.name }}, your workspace is ready.</mj-text>
        <mj-button background-color="#ff3e00" href="/editor">Get Started Now</mj-button>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`
		},
		newsletter: {
			file: 'product-changelog.mjml',
			title: 'Product Changelog #24',
			badge: 'Monthly Digest',
			subject: 'What’s new in FrostMail: Real-Time DNS Auditing',
			previewHtml: `
				<div class="space-y-3 text-neutral-800">
					<div class="inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Release v2.6</div>
					<h3 class="text-base font-bold text-neutral-900">What’s New in FrostMail</h3>
					<p class="text-xs text-neutral-600 leading-relaxed">AST compilation speed improvements, live JSON merge preview, and DNS-over-HTTPS diagnostics.</p>
					<div class="pt-1">
						<span class="inline-block rounded-md bg-neutral-900 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs">Read Full Notes</span>
					</div>
				</div>
			`,
			mjmlCode: `<mjml>
  <mj-body background-color="#f8fafc">
    <mj-section background-color="#ffffff">
      <mj-column>
        <mj-text font-size="12px" color="#059669" font-weight="bold">RELEASE V2.6</mj-text>
        <mj-text font-size="20px" font-weight="bold">What's New in FrostMail</mj-text>
        <mj-text color="#475569">Live merge tags and real-time DNS diagnostics.</mj-text>
        <mj-button background-color="#18181b" href="/blog">Read Full Notes</mj-button>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`
		}
	};

	const features = [
		{
			icon: Cpu,
			title: 'Pure AST & MJML Engine',
			category: 'Email Compilation',
			description:
				'Generates battle-tested, client-compliant HTML guaranteed to render perfectly across Outlook, Gmail, Apple Mail, and Yahoo.'
		},
		{
			icon: ShieldCheck,
			title: 'Real-Time DNS Auditor',
			category: 'Deliverability & Trust',
			description:
				'Queries DNS-over-HTTPS in real time for MX, SPF, DKIM selectors, and DMARC enforcement policies with 0–100 placement scoring.'
		},
		{
			icon: Variable,
			title: 'Live Merge Variables',
			category: 'Template Personalization',
			description:
				'Simulate dynamic JSON payloads with syntax interpolation ({{ user.name }}) and instant fallback previews directly on the canvas.'
		},
		{
			icon: Send,
			title: '1-Click Resend Dispatch',
			category: 'Inbox Verification',
			description:
				'Send live test renders straight to your actual inbox with custom sender headers and subject line overrides.'
		},
		{
			icon: Layers,
			title: 'Multi-Format Code Export',
			category: 'Zero Lock-In',
			description:
				'100% unlocked export to responsive HTML, React Email (.tsx), MJML XML, and portable JSON AST with zero watermarks.'
		},
		{
			icon: HardDrive,
			title: '100% Client-Side Local Mode',
			category: 'Privacy by Default',
			description:
				'Run completely offline in browser localStorage with a 25-step Undo/Redo stack, or connect Neon PostgreSQL for encrypted cloud sync.'
		}
	];

	function copyActiveMjml() {
		navigator.clipboard.writeText(presetsData[previewPreset].mjmlCode);
		copiedSnippet = true;
		setTimeout(() => (copiedSnippet = false), 2000);
	}
</script>

<Seo
	title="FrostMail — Open Source Visual Transactional Email Studio & Deliverability Auditor"
	description="Design responsive MJML emails, preview dynamic merge variables, audit DNS authentication records (SPF, DKIM, DMARC, MX), and dispatch test emails."
	ogImage={{
		title: 'FrostMail',
		description: 'Open source transactional email studio and real-time DNS deliverability auditor.',
		badge: '100% Free & Open Source'
	}}
	schema={[generateOrganizationSchema(siteConfig), generateSoftwareApplicationSchema(siteConfig)]}
/>

<div
	class="flex min-h-screen flex-col bg-neutral-950 font-sans text-neutral-100 antialiased selection:bg-primary-500/30 selection:text-primary-300"
>
	<!-- Standardized Top Navigation Bar -->
	<header
		class="sticky top-0 z-50 h-16 border-b border-neutral-800/80 bg-neutral-950/85 backdrop-blur-md"
	>
		<div class="mx-auto flex h-full max-w-6xl items-center justify-between px-6">
			<!-- Brand & Pill -->
			<div class="flex items-center gap-3">
				<a href="/" class="flex items-center gap-2.5 transition-opacity hover:opacity-90">
					<div
						class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500/10 text-primary-500 ring-1 ring-primary-500/30"
					>
						<Inbox class="h-4.5 w-4.5" />
					</div>
					<span class="text-lg font-bold tracking-tight text-white">FrostMail</span>
				</a>
				<Badge color="primary" variant="subtle" size="sm" class="hidden sm:inline-flex">
					MIT FOSS
				</Badge>
			</div>

			<!-- Center Links -->
			<nav class="hidden items-center gap-6 text-sm font-medium text-neutral-400 md:flex">
				<a href="/editor" class="transition-colors hover:text-white">Studio</a>
				<a href="/diagnostic" class="transition-colors hover:text-white">DNS Auditor</a>
				<a href="#features" class="transition-colors hover:text-white">Features</a>
				<a href="#architecture" class="transition-colors hover:text-white">Self-Hosting</a>
			</nav>

			<!-- Right Actions -->
			<div class="flex items-center gap-2.5">
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

				<a
					href="https://github.com/FuntionalFrost/"
					target="_blank"
					rel="noopener noreferrer"
					class="hidden sm:inline-flex"
				>
					<Button variant="outline" color="neutral" size="sm">
						<GithubIcon class="mr-1.5 h-4 w-4" />
						<span>GitHub</span>
					</Button>
				</a>

				<a href="/editor">
					<Button color="primary" size="sm">
						<span>Launch Studio</span>
						<ArrowRight class="ml-1.5 h-3.5 w-3.5" />
					</Button>
				</a>
			</div>
		</div>
	</header>

	<main class="flex-1">
		<!-- Hero Section -->
		<section class="relative mx-auto max-w-5xl px-6 pt-20 pb-16 text-center">
			<!-- Ambient Atmospheric Glow -->
			<div class="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
				<div class="h-90 w-160 rounded-full bg-primary-500/15 blur-[120px] transition-all"></div>
			</div>

			<!-- Announcement Pill -->
			<div
				class="inline-flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/10 px-4 py-1.5 text-xs font-semibold text-primary-400 backdrop-blur-xs"
			>
				<Sparkles class="h-3.5 w-3.5 text-primary-400" />
				<span>100% Free & Open-Source Email Engineering Suite</span>
			</div>

			<!-- Punchy Headline with Gradient Accent -->
			<h1 class="mt-6 text-4xl font-extrabold tracking-tight sm:text-6xl sm:leading-[1.12]">
				Design bulletproof emails.<br />
				<span
					class="bg-linear-to-r from-primary-400 via-primary-500 to-amber-400 bg-clip-text text-transparent"
				>
					Deliver with 100% confidence.
				</span>
			</h1>

			<!-- Subtitle -->
			<p class="mx-auto mt-6 max-w-2xl text-base text-neutral-400 sm:text-lg sm:leading-relaxed">
				FrostMail pairs a visual MJML canvas with real-time spam scoring, dynamic JSON merge tag
				simulation, and live DNS-over-HTTPS deliverability audits.
			</p>

			<!-- Hero CTAs -->
			<div class="mt-8 flex flex-wrap items-center justify-center gap-3">
				<a href="/editor">
					<Button size="lg" color="primary">
						<Zap class="mr-2 h-4 w-4" />
						<span>Open Template Studio</span>
					</Button>
				</a>
				<a href="/diagnostic">
					<Button size="lg" color="neutral" variant="outline">
						<Search class="mr-2 h-4 w-4" />
						<span>Audit Domain DNS</span>
					</Button>
				</a>
			</div>

			<!-- Quick stats bar -->
			<div
				class="mt-12 flex flex-wrap items-center justify-center gap-8 text-xs font-medium text-neutral-500"
			>
				<div class="flex items-center gap-1.5">
					<CheckCircle2 class="h-4 w-4 text-emerald-400" />
					<span>Zero Telemetry & Private by Default</span>
				</div>
				<div class="flex items-center gap-1.5">
					<CheckCircle2 class="h-4 w-4 text-emerald-400" />
					<span>Outlook & Gmail 102KB Safe</span>
				</div>
				<div class="flex items-center gap-1.5">
					<CheckCircle2 class="h-4 w-4 text-emerald-400" />
					<span>No Vendor Lock-In (HTML/MJML/TSX)</span>
				</div>
			</div>
		</section>

		<!-- Interactive Product Showcase Window -->
		<section class="mx-auto max-w-5xl px-6 pb-20">
			<div
				class="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/90 shadow-2xl backdrop-blur-md"
			>
				<!-- Window Header Bar with macOS-style dots & tabs -->
				<div
					class="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 bg-neutral-950/70 px-4 py-2.5"
				>
					<!-- Left: Window Dots & Active Preset -->
					<div class="flex items-center gap-2">
						<div class="flex items-center gap-1.5 pr-2">
							<span class="h-3 w-3 rounded-full bg-rose-500/80"></span>
							<span class="h-3 w-3 rounded-full bg-amber-500/80"></span>
							<span class="h-3 w-3 rounded-full bg-emerald-500/80"></span>
						</div>
						<span class="font-mono text-xs text-neutral-400">
							frostmail-studio &bull; {presetsData[previewPreset].file}
						</span>
					</div>

					<!-- Center Preset Switcher -->
					<div
						class="flex items-center gap-1 rounded-lg border border-neutral-800 bg-neutral-900 p-1"
					>
						<button
							type="button"
							class="rounded-md px-2.5 py-1 text-xs font-semibold transition-colors {previewPreset ===
							'receipt'
								? 'bg-primary-500 text-white'
								: 'text-neutral-400 hover:text-white'}"
							onclick={() => (previewPreset = 'receipt')}
						>
							Order Receipt
						</button>
						<button
							type="button"
							class="rounded-md px-2.5 py-1 text-xs font-semibold transition-colors {previewPreset ===
							'welcome'
								? 'bg-primary-500 text-white'
								: 'text-neutral-400 hover:text-white'}"
							onclick={() => (previewPreset = 'welcome')}
						>
							Welcome
						</button>
						<button
							type="button"
							class="rounded-md px-2.5 py-1 text-xs font-semibold transition-colors {previewPreset ===
							'newsletter'
								? 'bg-primary-500 text-white'
								: 'text-neutral-400 hover:text-white'}"
							onclick={() => (previewPreset = 'newsletter')}
						>
							Changelog
						</button>
					</div>

					<!-- Right Status Metrics -->
					<div class="flex items-center gap-2 text-xs">
						<span
							class="rounded border border-emerald-800/60 bg-emerald-950/60 px-2 py-0.5 font-semibold text-emerald-300"
						>
							Spam: 96/100 Safe
						</span>
						<span class="rounded bg-neutral-800 px-2 py-0.5 font-mono text-neutral-300">
							640px Canvas
						</span>
					</div>
				</div>

				<!-- Window Body: Interactive 2-Column Showcase -->
				<div class="grid min-h-105 grid-cols-1 lg:grid-cols-12">
					<!-- Left: Visual Rendered Card -->
					<div
						class="flex flex-col justify-between border-b border-neutral-800 bg-neutral-950/40 p-6 sm:p-8 lg:col-span-7 lg:border-r lg:border-b-0"
					>
						<div class="space-y-4">
							<div class="flex items-center justify-between text-xs text-neutral-400">
								<span class="font-semibold tracking-wider text-primary-400 uppercase"
									>Live Visual Simulation</span
								>
								<span class="rounded bg-neutral-800 px-2 py-0.5 text-neutral-300"
									>Responsive MJML Viewport</span
								>
							</div>

							<!-- Rendered Email Mock Card -->
							<div class="rounded-xl border border-neutral-200 bg-white p-6 shadow-xl">
								{@html presetsData[previewPreset].previewHtml}
							</div>
						</div>

						<div
							class="mt-6 flex items-center justify-between border-t border-neutral-800/80 pt-4 text-xs text-neutral-400"
						>
							<span
								>Subject: <strong class="text-neutral-200"
									>{presetsData[previewPreset].subject}</strong
								></span
							>
							<a
								href="/editor"
								class="inline-flex items-center gap-1 font-semibold text-primary-400 hover:underline"
							>
								<span>Edit in Studio</span>
								<ExternalLink class="h-3 w-3" />
							</a>
						</div>
					</div>

					<!-- Right: Synchronized AST / MJML Code -->
					<div class="flex flex-col justify-between bg-neutral-950/80 p-6 lg:col-span-5">
						<div class="space-y-3">
							<div class="flex items-center justify-between text-xs">
								<span class="flex items-center gap-1.5 font-mono text-neutral-400">
									<Terminal class="h-3.5 w-3.5 text-primary-500" />
									<span>Generated MJML Markup</span>
								</span>
								<button
									type="button"
									onclick={copyActiveMjml}
									class="inline-flex items-center gap-1 text-xs text-neutral-400 transition-colors hover:text-white"
								>
									{#if copiedSnippet}
										<CheckIcon class="h-3.5 w-3.5 text-emerald-400" />
										<span class="font-semibold text-emerald-400">Copied!</span>
									{:else}
										<Copy class="h-3.5 w-3.5" />
										<span>Copy</span>
									{/if}
								</button>
							</div>

							<pre
								class="max-h-75 overflow-x-auto rounded-lg border border-neutral-800/80 bg-neutral-950 p-4 font-mono text-xs leading-relaxed text-neutral-300"><code
									>{presetsData[previewPreset].mjmlCode}</code
								></pre>
						</div>

						<div
							class="mt-4 rounded-lg border border-primary-500/20 bg-primary-500/5 p-3 text-xs text-neutral-300"
						>
							<span class="font-bold text-primary-400">Zero-Overhead Compilation:</span> Compiles into
							pure, bulletproof HTML with Outlook VML tags in sub-10ms.
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Features Bento Grid -->
		<section id="features" class="mx-auto max-w-6xl border-t border-neutral-800/80 px-6 py-20">
			<div class="mx-auto mb-14 max-w-2xl space-y-3 text-center">
				<div
					class="inline-flex items-center gap-1.5 rounded-full bg-primary-500/10 px-3.5 py-1 text-xs font-bold text-primary-400"
				>
					<Sparkles class="h-3.5 w-3.5" />
					<span>Engineered for Production</span>
				</div>
				<h2 class="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
					Everything you need for transactional email.
				</h2>
				<p class="text-base leading-relaxed text-neutral-400">
					Built with Svelte 5 runes, Yaxa UI primitives, and Tailwind CSS v4 design tokens.
				</p>
			</div>

			<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each features as feat (feat.title)}
					<div
						class="group relative space-y-3 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-7 transition-all duration-200 hover:border-neutral-700 hover:bg-neutral-900"
					>
						<div
							class="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-500/10 text-primary-400 ring-1 ring-primary-500/30 transition-transform group-hover:scale-105"
						>
							<feat.icon class="h-5 w-5" />
						</div>
						<div class="text-xs font-semibold tracking-wider text-primary-400 uppercase">
							{feat.category}
						</div>
						<h3 class="text-lg font-bold text-white">{feat.title}</h3>
						<p class="text-sm leading-relaxed text-neutral-400">
							{feat.description}
						</p>
					</div>
				{/each}
			</div>
		</section>

		<!-- DX Comparison Section: Legacy vs FrostMail -->
		<section class="mx-auto max-w-5xl border-t border-neutral-800/80 px-6 py-20">
			<div class="mx-auto mb-14 max-w-2xl space-y-3 text-center">
				<div
					class="inline-flex items-center gap-1.5 rounded-full bg-primary-500/10 px-3.5 py-1 text-xs font-bold text-primary-400"
				>
					<Code class="h-3.5 w-3.5" />
					<span>Developer Experience</span>
				</div>
				<h2 class="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
					See the DX Difference
				</h2>
				<p class="text-base leading-relaxed text-neutral-400">
					Stop writing nested table hacks and broken inline CSS. Write declarative AST blocks.
				</p>
			</div>

			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<!-- Legacy HTML Table Nightmare -->
				<div class="space-y-4 rounded-2xl border border-rose-900/50 bg-rose-950/20 p-6">
					<div class="flex items-center justify-between">
						<span class="flex items-center gap-2 text-sm font-bold text-rose-400">
							<span>✕</span>
							<span>Legacy Table-Based Email HTML</span>
						</span>
						<span class="rounded bg-rose-950 px-2 py-0.5 font-mono text-xs text-rose-300"
							>Painful</span
						>
					</div>
					<pre
						class="max-h-55 overflow-x-auto rounded-lg border border-rose-900/40 bg-neutral-950 p-4 font-mono text-xs leading-relaxed text-rose-200/80"><code
							>&lt;!-- Nested 1999 Table Hack --&gt;
&lt;table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"&gt;
  &lt;tr&gt;
    &lt;td align="center" style="padding: 20px 0;"&gt;
      &lt;!--[if mso]&gt;
      &lt;v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" arcsize="10%" fillcolor="#ff3e00"&gt;
      &lt;![endif]--&gt;
      &lt;a href="..." style="background:#ff3e00;padding:12px 24px;color:#fff;"&gt;Button&lt;/a&gt;
      &lt;!--[if mso]&gt;&lt;/v:roundrect&gt;&lt;![endif]--&gt;
    &lt;/td&gt;
  &lt;/tr&gt;
&lt;/table&gt;</code
						></pre>
					<p class="text-xs text-rose-300/80">
						Brittle, impossible to preview with mock data, breaks on mobile, and clips in Gmail.
					</p>
				</div>

				<!-- FrostMail Clean AST & MJML -->
				<div class="space-y-4 rounded-2xl border border-emerald-900/50 bg-emerald-950/20 p-6">
					<div class="flex items-center justify-between">
						<span class="flex items-center gap-2 text-sm font-bold text-emerald-400">
							<CheckIcon class="h-4 w-4" />
							<span>FrostMail Clean MJML AST</span>
						</span>
						<span class="rounded bg-emerald-950 px-2 py-0.5 font-mono text-xs text-emerald-300"
							>Modern DX</span
						>
					</div>
					<pre
						class="max-h-55 overflow-x-auto rounded-lg border border-emerald-900/40 bg-neutral-950 p-4 font-mono text-xs leading-relaxed text-emerald-200/80"><code
							>&lt;!-- Declarative, Reactive & Typed --&gt;
&lt;mj-section background-color="#ffffff" border-radius="12px"&gt;
  &lt;mj-column&gt;
    &lt;mj-text font-size="20px" font-weight="bold"&gt;Order #{'{'}{'{'} order.id }}&lt;/mj-text&gt;
    &lt;mj-text color="#64748b"&gt;Hi {'{'}{'{'} user.name }}, your invoice is ready.&lt;/mj-text&gt;
    &lt;mj-button background-color="#ff3e00" href="{'{'}{'{'} invoice.url }}"&gt;
      Download Receipt
    &lt;/mj-button&gt;
  &lt;/mj-column&gt;
&lt;/mj-section&gt;</code
						></pre>
					<p class="text-xs text-emerald-300/80">
						Responsive across 60+ email clients, live variable simulation, and instant React Email
						export.
					</p>
				</div>
			</div>
		</section>

		<!-- Open Source & Self-Hosting Architecture Section -->
		<section id="architecture" class="mx-auto max-w-5xl border-t border-neutral-800/80 px-6 py-20">
			<div class="mx-auto mb-14 max-w-2xl space-y-3 text-center">
				<div
					class="inline-flex items-center gap-1.5 rounded-full bg-primary-500/10 px-3.5 py-1 text-xs font-bold text-primary-400"
				>
					<Sparkles class="h-3.5 w-3.5" />
					<span>100% Free & Open Source</span>
				</div>
				<h2 class="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
					Freedom First. Zero Paywalls.
				</h2>
				<p class="text-base leading-relaxed text-neutral-400">
					Use the web studio directly in your browser with zero sign-up, or self-host your own
					instance with custom cloud storage.
				</p>
			</div>

			<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
				<!-- Zero Setup Studio -->
				<div
					class="flex flex-col justify-between space-y-6 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-8 shadow-sm"
				>
					<div class="space-y-4">
						<div class="flex items-center justify-between">
							<div>
								<h3 class="text-xl font-bold text-white">Local Studio</h3>
								<p class="mt-1 text-sm text-neutral-400">Instant browser-only mode, 100% private</p>
							</div>
							<div class="rounded-lg bg-neutral-800 p-2.5">
								<HardDrive class="h-5 w-5 text-neutral-300" />
							</div>
						</div>

						<div class="flex items-baseline gap-1.5">
							<span class="text-4xl font-black text-white">Free</span>
							<span class="text-sm font-medium text-neutral-400">/ MIT Licensed</span>
						</div>

						<div class="space-y-3 pt-2">
							{#each ['Zero registration or cloud account required', 'Local browser storage with 25-step Undo/Redo', 'Real-time MJML compilation & AST generation', 'Multi-format export (HTML, MJML, React Email .tsx)', 'Live DNS DoH deliverability auditing & scoring'] as feat (feat)}
								<div class="flex items-center gap-2.5 text-sm text-neutral-300">
									<Check class="h-4.5 w-4.5 shrink-0 text-primary-500" />
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
					class="relative flex flex-col justify-between space-y-6 rounded-2xl border-2 border-primary-500/40 bg-neutral-900/80 p-8 shadow-xl"
				>
					<div
						class="absolute -top-3.5 right-6 rounded-full bg-primary-600 px-3.5 py-1 text-xs font-bold text-white shadow-sm"
					>
						Self-Hostable
					</div>

					<div class="space-y-4">
						<div class="flex items-center justify-between">
							<div>
								<h3 class="text-xl font-bold text-white">Self-Hosted & BYOK</h3>
								<p class="mt-1 text-sm text-neutral-400">
									For teams and production backend workflows
								</p>
							</div>
							<div class="rounded-lg bg-primary-500/20 p-2.5">
								<Server class="h-5 w-5 text-primary-400" />
							</div>
						</div>

						<div class="flex items-baseline gap-2">
							<span class="text-4xl font-black text-white">100%</span>
							<span class="text-sm font-medium text-neutral-400">Open Source</span>
						</div>

						<div class="space-y-3 pt-2">
							{#each ['Deploy with Docker, Vercel, Node, or Netlify', 'Encrypted PostgreSQL database sync (Neon/Local)', 'BYOK Resend API for 1-click test inbox delivery', 'Cloudflare R2 / AWS S3 media asset storage', 'Complete source code access with zero lock-in'] as feat (feat)}
								<div class="flex items-center gap-2.5 text-sm text-neutral-300">
									<CheckCircle2 class="h-4.5 w-4.5 shrink-0 text-primary-500" />
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
								<span>GitHub</span>
							</Button>
						</a>
						<Button
							size="lg"
							color="neutral"
							variant="subtle"
							aria-label="Support FrostMail"
							onclick={() => (isSponsorOpen = true)}
						>
							<span class="text-rose-400">♥</span>
						</Button>
					</div>
				</div>
			</div>
		</section>
	</main>

	<!-- Standardized 4-Column Global Footer -->
	<footer class="border-t border-neutral-800/80 bg-neutral-950 py-16 text-sm text-neutral-400">
		<div class="mx-auto max-w-6xl px-6">
			<div class="grid grid-cols-1 gap-10 md:grid-cols-12">
				<!-- Brand Col -->
				<div class="space-y-4 md:col-span-5">
					<div class="flex items-center gap-2.5">
						<div
							class="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-500/10 text-primary-500 ring-1 ring-primary-500/30"
						>
							<Inbox class="h-4 w-4" />
						</div>
						<span class="text-base font-bold tracking-tight text-white">FrostMail</span>
						<Badge color="primary" variant="subtle" size="sm">MIT</Badge>
					</div>
					<p class="max-w-sm text-xs leading-relaxed text-neutral-400">
						100% Free & Open-Source Visual Transactional Email Studio & Domain Deliverability
						Auditor. Built with SvelteKit 2, Svelte 5 Runes, MJML, and Tailwind CSS v4.
					</p>
					<div class="text-xs text-neutral-500">&copy; 2026 FrostMail &bull; MIT Licensed</div>
				</div>

				<!-- Navigation Col -->
				<div class="space-y-3 md:col-span-2">
					<div class="text-xs font-bold tracking-wider text-neutral-300 uppercase">Navigation</div>
					<ul class="space-y-2 text-xs">
						<li><a href="/editor" class="transition-colors hover:text-white">Studio</a></li>
						<li>
							<a href="/diagnostic" class="transition-colors hover:text-white">DNS Auditor</a>
						</li>
						<li><a href="#features" class="transition-colors hover:text-white">Features</a></li>
						<li>
							<a href="#architecture" class="transition-colors hover:text-white">Self-Hosting</a>
						</li>
					</ul>
				</div>

				<!-- Legal & Compliance Col -->
				<div class="space-y-3 md:col-span-3">
					<div class="text-xs font-bold tracking-wider text-neutral-300 uppercase">
						Legal & Compliance
					</div>
					<ul class="space-y-2 text-xs">
						<li>
							<a href="/privacy" class="transition-colors hover:text-white">Privacy Policy</a>
						</li>
						<li>
							<a href="/terms" class="transition-colors hover:text-white">Terms of Service</a>
						</li>
						<li><a href="/refunds" class="transition-colors hover:text-white">Refund Policy</a></li>
						<li><a href="/impressum" class="transition-colors hover:text-white">Impressum</a></li>
					</ul>
				</div>

				<!-- Community Col -->
				<div class="space-y-3 md:col-span-2">
					<div class="text-xs font-bold tracking-wider text-neutral-300 uppercase">Community</div>
					<ul class="space-y-2 text-xs">
						<li>
							<a
								href="https://github.com/FuntionalFrost/"
								target="_blank"
								rel="noopener noreferrer"
								class="inline-flex items-center gap-1 transition-colors hover:text-white"
							>
								<span>GitHub</span>
								<ExternalLink class="h-3 w-3 opacity-60" />
							</a>
						</li>
						<li>
							<a
								href="https://yaxa.vercel.app"
								target="_blank"
								rel="noopener noreferrer"
								class="inline-flex items-center gap-1 transition-colors hover:text-white"
							>
								<span>Built with Yaxa</span>
								<ExternalLink class="h-3 w-3 opacity-60" />
							</a>
						</li>
						<li>
							<button
								type="button"
								class="text-left transition-colors hover:text-white"
								onclick={() => (isSponsorOpen = true)}
							>
								Support FOSS ♥
							</button>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</footer>

	<!-- Modals -->
	<SponsorModal bind:open={isSponsorOpen} />
	<ThemeModal bind:open={isThemeOpen} />
</div>
