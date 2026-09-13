<!-- src/routes/login/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, FormField, Input, Tabs, Seo, Alert } from 'yaxa-svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import { ArrowLeft, Mail, User, Sparkles, AlertCircle } from '@lucide/svelte';
	import type { ActionData, PageData } from './$types';

	let { form, data }: { form: ActionData; data: PageData } = $props();

	let authMode = $state('signin');
	let isSubmitting = $state(false);

	const authTabs = [
		{ value: 'signin', label: 'Sign In' },
		{ value: 'signup', label: 'Create Account' }
	];
</script>

<Seo
	title="Sign In / Register"
	description="Sign in or register for FrostMail to save email designs, sync merge variables, and audit domain deliverability."
/>

<div
	class="flex min-h-screen flex-col bg-neutral-50 text-neutral-900 transition-colors dark:bg-neutral-950 dark:text-neutral-100"
>
	<!-- Top Bar -->
	<header
		class="border-b border-neutral-200 bg-white/90 px-6 py-4 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/90"
	>
		<div class="mx-auto flex max-w-5xl items-center justify-between">
			<a
				href="/"
				class="flex items-center gap-2 text-sm font-semibold text-neutral-700 transition hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
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

	<!-- Main Container -->
	<main class="flex flex-1 items-center justify-center p-6">
		<div class="w-full max-w-md space-y-6">
			<!-- Header / Brand Icon -->
			<div class="space-y-2 text-center">
				<div
					class="bg-primary-500 shadow-primary-500/25 mx-auto flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-lg"
				>
					<Sparkles class="h-6 w-6" />
				</div>
				<h1 class="text-2xl font-black tracking-tight text-neutral-900 dark:text-neutral-50">
					{authMode === 'signin' ? 'Welcome Back to FrostMail' : 'Create Your Account'}
				</h1>
				<p class="text-sm text-neutral-600 dark:text-neutral-400">
					{authMode === 'signin'
						? 'Sign in to access your saved templates and deliverability reports.'
						: 'Unlock cloud backups, domain auditing, and visual email design tools.'}
				</p>
			</div>

			<!-- Card -->
			<div
				class="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl dark:border-neutral-800 dark:bg-neutral-900"
			>
				<!-- Segmented Mode Switcher -->
				<div class="mb-6">
					<Tabs items={authTabs} bind:value={authMode} variant="segmented" class="w-full" />
				</div>

				<!-- Social Sign In (GitHub) -->
				<form
					method="post"
					action="?/signInSocial"
					use:enhance={() => {
						isSubmitting = true;
						return async ({ update }) => {
							isSubmitting = false;
							await update();
						};
					}}
				>
					<input type="hidden" name="provider" value="github" />
					<input type="hidden" name="callbackURL" value={data.callbackURL} />
					<Button
						type="submit"
						block
						size="md"
						color="neutral"
						variant="outline"
						loading={isSubmitting}
						class="flex items-center justify-center gap-2 border-neutral-300 font-semibold text-neutral-800 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-800"
					>
						<svg class="h-5 w-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
							<path
								d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
							/>
						</svg>
						<span>Continue with GitHub</span>
					</Button>
				</form>

				<!-- Divider -->
				<div class="my-5 flex items-center gap-3">
					<div class="h-px flex-1 bg-neutral-200 dark:bg-neutral-800"></div>
					<span
						class="text-xs font-semibold tracking-wider text-neutral-400 uppercase dark:text-neutral-500"
					>
						Or continue with email
					</span>
					<div class="h-px flex-1 bg-neutral-200 dark:bg-neutral-800"></div>
				</div>

				<!-- Error Banner -->
				{#if form?.message}
					<div class="mb-4">
						<Alert color="error" title="Authentication Error" class="text-sm">
							<div class="flex items-center gap-2">
								<AlertCircle class="h-4 w-4 shrink-0" />
								<span>{form.message}</span>
							</div>
						</Alert>
					</div>
				{/if}

				<!-- Email & Password Form -->
				{#if authMode === 'signin'}
					<form
						method="post"
						action="?/signInEmail"
						use:enhance={() => {
							isSubmitting = true;
							return async ({ update }) => {
								isSubmitting = false;
								await update();
							};
						}}
						class="space-y-4"
					>
						<FormField label="Email Address">
							<Input
								type="email"
								name="email"
								placeholder="alex@company.com"
								required
								autocomplete="email"
								size="md"
							/>
						</FormField>

						<FormField label="Password">
							<Input
								type="password"
								name="password"
								placeholder="••••••••"
								required
								autocomplete="current-password"
								size="md"
							/>
						</FormField>

						<Button
							type="submit"
							block
							size="md"
							color="primary"
							loading={isSubmitting}
							class="mt-2 font-semibold"
						>
							<Mail class="mr-2 h-4 w-4" />
							Sign In
						</Button>
					</form>
				{:else}
					<form
						method="post"
						action="?/signUpEmail"
						use:enhance={() => {
							isSubmitting = true;
							return async ({ update }) => {
								isSubmitting = false;
								await update();
							};
						}}
						class="space-y-4"
					>
						<FormField label="Your Name">
							<Input
								type="text"
								name="name"
								placeholder="Alex Johnson"
								autocomplete="name"
								size="md"
							/>
						</FormField>

						<FormField label="Email Address">
							<Input
								type="email"
								name="email"
								placeholder="alex@company.com"
								required
								autocomplete="email"
								size="md"
							/>
						</FormField>

						<FormField label="Create Password">
							<Input
								type="password"
								name="password"
								placeholder="At least 8 characters"
								required
								autocomplete="new-password"
								size="md"
							/>
						</FormField>

						<Button
							type="submit"
							block
							size="md"
							color="primary"
							loading={isSubmitting}
							class="mt-2 font-semibold"
						>
							<User class="mr-2 h-4 w-4" />
							Create Account
						</Button>
					</form>
				{/if}

				<!-- Disclaimer & Legal Links -->
				<p class="mt-6 text-center text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
					By continuing, you agree to our
					<a
						href="/terms"
						class="underline hover:text-neutral-900 dark:hover:text-white"
						target="_blank"
					>
						Terms of Service
					</a>
					and
					<a
						href="/privacy"
						class="underline hover:text-neutral-900 dark:hover:text-white"
						target="_blank"
					>
						Privacy Policy
					</a>.
				</p>
			</div>
		</div>
	</main>
</div>
