<!-- src/routes/privacy/+page.svelte -->
<script lang="ts">
	import { Seo, LegalDocument } from 'yaxa-svelte';
	import ThemeToggle from '#lib/components/ThemeToggle.svelte';
	import { ArrowLeft } from '@lucide/svelte';
</script>

<Seo
	title="Privacy Policy"
	description="Privacy policy and data protection practices for FrostMail, covering ethical advertising, authentication, and local data storage."
/>

<div
	class="min-h-screen bg-white text-neutral-900 transition-colors dark:bg-neutral-950 dark:text-neutral-100"
>
	<!-- Navigation Bar -->
	<header
		class="border-b border-neutral-200 bg-white/90 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/90"
	>
		<div class="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
			<a
				href="/"
				class="flex items-center gap-2 text-sm font-semibold text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
			>
				<ArrowLeft class="h-4 w-4" />
				<span>Back to FrostMail</span>
			</a>
			<div class="flex items-center gap-3">
				<a
					href="/editor"
					class="text-primary-600 hover:text-primary-700 dark:text-primary-400 text-sm font-semibold"
				>
					Open Studio
				</a>
				<ThemeToggle />
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-4xl px-6 py-12">
		<LegalDocument
			type="privacy"
			customClauses={[
				{
					id: 'template-storage',
					title: '8. Email Template Data & Diagnostics',
					content:
						'Guest designs are stored solely in your local browser storage (`localStorage`). Cloud-saved templates are encrypted and stored in PostgreSQL under your authenticated account. Diagnostic DNS queries and spam score analyses are processed in-memory and never sold or shared.'
				}
			]}
		/>
	</main>
</div>
