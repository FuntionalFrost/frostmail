<!-- src/lib/components/ImageUploader.svelte -->
<script lang="ts">
	import { FormField, Input } from 'yaxa-svelte';
	import { Image, Loader2 } from '@lucide/svelte';

	interface Props {
		src?: string;
	}

	let { src = $bindable('') }: Props = $props();

	let isUploading = $state(false);
	let uploadError = $state<string | null>(null);
	let isDragging = $state(false);
	let fileInput = $state<HTMLInputElement | null>(null);

	async function uploadFile(file: File) {
		if (!file.type.startsWith('image/')) {
			uploadError = 'Please select a valid image file.';
			return;
		}

		uploadError = null;
		isUploading = true;

		try {
			const formData = new FormData();
			formData.append('file', file);

			const res = await fetch('/api/assets/upload', {
				method: 'POST',
				body: formData
			});

			if (!res.ok) {
				const errData = (await res.json().catch(() => ({}))) as { message?: string };
				throw new Error(errData.message || 'Upload failed.');
			}

			const data = (await res.json()) as { url: string };
			src = data.url;
		} catch (err: unknown) {
			const e = err as Error;
			uploadError = e.message || 'Upload failed. Please try again.';
		} finally {
			isUploading = false;
		}
	}

	function handleDrop(e: DragEvent) {
		isDragging = false;
		const files = e.dataTransfer?.files;
		if (files && files.length > 0) {
			const firstFile = files[0];
			if (firstFile) uploadFile(firstFile);
		}
	}

	function handleFileInput(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target.files && target.files.length > 0) {
			const firstFile = target.files[0];
			if (firstFile) uploadFile(firstFile);
		}
	}
</script>

<div class="space-y-3 text-sm">
	<!-- Dropzone Area -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="relative flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed p-4 text-center transition {isDragging
			? 'border-primary-500 bg-primary-50/50 dark:bg-primary-950/20'
			: 'border-neutral-300 bg-neutral-50/50 hover:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900/50 dark:hover:border-neutral-600'}"
		ondragover={(e) => {
			e.preventDefault();
			isDragging = true;
		}}
		ondragleave={(e) => {
			e.preventDefault();
			isDragging = false;
		}}
		ondrop={(e) => {
			e.preventDefault();
			handleDrop(e);
		}}
		onclick={() => fileInput?.click()}
	>
		<input
			bind:this={fileInput}
			type="file"
			accept="image/*"
			class="hidden"
			onchange={handleFileInput}
		/>

		{#if isUploading}
			<Loader2 class="text-primary-500 h-6 w-6 animate-spin" />
		{:else}
			<Image class="h-6 w-6 text-neutral-400" />
		{/if}

		<div class="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
			{isUploading ? 'Uploading asset...' : 'Drop image or browse'}
		</div>
		<div class="text-sm text-neutral-500 dark:text-neutral-400">PNG, JPG, WEBP, GIF up to 5 MB</div>
	</div>

	{#if uploadError}
		<p class="text-sm font-semibold text-rose-500">{uploadError}</p>
	{/if}

	<!-- Manual URL Input -->
	<FormField label="Or External Image URL">
		<Input bind:value={src} placeholder="https://images.example.com/logo.png" size="sm" />
	</FormField>
</div>
