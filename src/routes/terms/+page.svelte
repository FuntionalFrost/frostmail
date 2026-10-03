<!-- src/routes/terms/+page.svelte -->
<script lang="ts">
	import { Seo, LegalDocument } from 'yaxa-svelte';
	import ThemeToggle from '#lib/components/ThemeToggle.svelte';
	import { ArrowLeft } from '@lucide/svelte';
</script>

<Seo
	title="Terms of Service"
	description="The terms and conditions governing your access to and use of FrostMail."
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
			type="terms"
			customClauses={[
				{
					id: 'anti-spam',
					title: '7. Anti-Spam & Deliverability Policy',
					content:
						'You agree not to use FrostMail for generating phishing lures, malware vectors, or unsolicited commercial email in violation of CAN-SPAM or GDPR. FrostMail provides deliverability diagnostics and scoring as analytical guidelines and does not guarantee third-party mailbox placement.'
				}
			]}
		/>
	</main>
</div>
