<!-- src/lib/components/SendTestModal.svelte -->
<script lang="ts">
	import { studio } from '$lib/stores/studio.svelte';
	import { Modal, FormField, Input, Button } from 'yaxa-svelte';
	import { Send, CheckCircle2, AlertCircle } from '@lucide/svelte';

	interface Props {
		open?: boolean;
	}

	let { open = $bindable(false) }: Props = $props();

	let recipientEmail = $state('');
	let customApiKey = $state('');
	let customSender = $state('');
	let isSending = $state(false);
	let sendStatus = $state<{ success: boolean; message: string } | null>(null);

	async function handleSend() {
		if (!recipientEmail.includes('@')) {
			sendStatus = { success: false, message: 'Please enter a valid email address.' };
			return;
		}

		isSending = true;
		sendStatus = null;

		try {
			const res = await fetch('/api/mail/send-test', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					to: recipientEmail.trim(),
					apiKey: customApiKey.trim() || undefined,
					from: customSender.trim() || undefined,
					template: $state.snapshot(studio.template),
					mockData: studio.parsedMockData
				})
			});

			const data = (await res.json()) as { success: boolean; messageId?: string; message?: string };

			if (!res.ok) {
				sendStatus = {
					success: false,
					message: data.message || 'Failed to dispatch test email.'
				};
				return;
			}

			sendStatus = {
				success: true,
				message: `Email dispatched successfully (ID: ${data.messageId})`
			};
		} catch (err: unknown) {
			const e = err as Error;
			sendStatus = {
				success: false,
				message: e.message || 'Failed to send test email.'
			};
		} finally {
			isSending = false;
		}
	}
</script>

<Modal
	bind:open
	title="Send Test Email"
	description="Dispatch a live test render using the Resend API."
	size="md"
>
	<form
		class="space-y-4"
		onsubmit={(e) => {
			e.preventDefault();
			handleSend();
		}}
	>
		<FormField label="Recipient Email" required>
			<Input type="email" bind:value={recipientEmail} placeholder="you@example.com" size="sm" />
		</FormField>

		<FormField label="Sender Address (Optional)">
			<Input bind:value={customSender} placeholder="FrostMail <onboarding@resend.dev>" size="sm" />
		</FormField>

		<FormField label="Resend API Key (Optional Override)">
			<Input type="password" bind:value={customApiKey} placeholder="re_xxxxxxxxxxxx" size="sm" />
		</FormField>

		{#if sendStatus}
			<div
				class="flex items-center gap-2 rounded-lg p-3 text-sm {sendStatus.success
					? 'border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300'
					: 'border border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300'}"
			>
				{#if sendStatus.success}
					<CheckCircle2 class="h-4 w-4 shrink-0" />
				{:else}
					<AlertCircle class="h-4 w-4 shrink-0" />
				{/if}
				<span>{sendStatus.message}</span>
			</div>
		{/if}

		<div class="flex justify-end gap-2 pt-2">
			<Button variant="ghost" color="neutral" size="sm" onclick={() => (open = false)}>
				Cancel
			</Button>
			<Button type="submit" color="primary" size="sm" loading={isSending}>
				<Send class="mr-1.5 h-3.5 w-3.5" />
				Dispatch Email
			</Button>
		</div>
	</form>
</Modal>
