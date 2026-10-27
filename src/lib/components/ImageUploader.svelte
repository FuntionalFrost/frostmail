<!-- src/lib/components/ImageUploader.svelte -->
<script lang="ts">
	import { FormField, Input, Dropzone } from 'yaxa-svelte';

	interface Props {
		src?: string;
	}

	let { src = $bindable('') }: Props = $props();
	let uploadError = $state<string | null>(null);
</script>

<div class="space-y-3 text-sm">
	<Dropzone
		accept="image/*"
		maxSize={5 * 1024 * 1024}
		multiple={false}
		autoUpload={true}
		endpoint="/api/assets/upload"
		label="Drop image or browse"
		description="PNG, JPG, WEBP, GIF, SVG up to 5 MB"
		onsuccess={(res) => {
			uploadError = null;
			src = res.url;
		}}
		onerror={(err) => {
			uploadError = err;
		}}
	/>

	{#if uploadError}
		<p class="text-sm font-semibold text-rose-500">{uploadError}</p>
	{/if}

	<!-- Manual URL Input -->
	<FormField label="Or External Image URL">
		<Input bind:value={src} placeholder="https://images.example.com/logo.png" size="sm" />
	</FormField>
</div>
