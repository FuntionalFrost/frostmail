<!-- src/lib/components/AuthModal.svelte -->
<script lang="ts">
	import { Modal, Button, Badge } from 'yaxa-svelte';
	import { LogOut, Sparkles, User } from '@lucide/svelte';

	interface Props {
		open?: boolean;
		user?: { id?: string; name?: string; email?: string; image?: string; tier?: string } | null;
	}

	let { open = $bindable(false), user = null }: Props = $props();

	let isLoggedIn = $derived(!!user?.id);

	async function handleLogout() {
		try {
			await fetch('/api/auth/sign-out', { method: 'POST' });
			window.location.reload();
		} catch (err) {
			console.error('Logout error:', err);
		}
	}
</script>

<Modal
	bind:open
	title={isLoggedIn ? 'Account Profile' : 'Sign In to FrostMail'}
	description={isLoggedIn
		? 'Manage your account and cloud sync preferences.'
		: 'Sync templates across devices, audit domains, and unlock Pro email features.'}
	size="sm"
>
	<div class="space-y-4 text-sm">
		{#if isLoggedIn}
			<div class="space-y-4 text-center">
				<div
					class="bg-primary-100 text-primary-600 dark:bg-primary-950 dark:text-primary-400 mx-auto flex h-14 w-14 items-center justify-center rounded-full"
				>
					{#if user?.image}
						<img
							src={user.image}
							alt={user.name || 'User'}
							class="h-14 w-14 rounded-full object-cover"
						/>
					{:else}
						<User class="h-7 w-7" />
					{/if}
				</div>

				<div>
					<h3 class="text-lg font-bold text-neutral-900 dark:text-neutral-100">
						{user?.name || 'FrostMail User'}
					</h3>
					<p class="text-sm text-neutral-600 dark:text-neutral-400">{user?.email}</p>
				</div>

				<div>
					<Badge color={user?.tier === 'pro' ? 'primary' : 'neutral'} variant="subtle" size="sm">
						{#if user?.tier === 'pro'}
							<Sparkles class="mr-1 h-4 w-4" />
							FrostMail Pro
						{:else}
							<User class="mr-1 h-4 w-4" />
							Free Community Plan
						{/if}
					</Badge>
				</div>

				<div
					class="flex justify-between gap-2 border-t border-neutral-200 pt-3 dark:border-neutral-800"
				>
					<Button
						color="neutral"
						variant="outline"
						size="sm"
						class="flex-1"
						onclick={() => (open = false)}
					>
						Close
					</Button>
					<Button color="error" variant="ghost" size="sm" onclick={handleLogout}>
						<LogOut class="mr-1.5 h-4 w-4" />
						Sign Out
					</Button>
				</div>
			</div>
		{:else}
			<div class="space-y-3 pt-1">
				<a href="/demo/better-auth/login" class="block w-full">
					<Button block color="primary" size="md">Sign In / Register</Button>
				</a>

				<p class="pt-1 text-center text-sm text-neutral-500 dark:text-neutral-400">
					By signing in, you agree to our Terms of Service and Privacy Policy.
				</p>
			</div>
		{/if}
	</div>
</Modal>
