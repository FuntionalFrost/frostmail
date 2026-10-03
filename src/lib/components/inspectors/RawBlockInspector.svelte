<!-- src/lib/components/inspectors/RawBlockInspector.svelte -->
<script lang="ts">
	import { studio } from '$lib/stores/studio.svelte';
	import type { RawBlock } from '$lib/types/email';
	import { FormField, Textarea } from 'yaxa-svelte';

	let { block = $bindable() }: { block: RawBlock } = $props();
</script>

<div class="space-y-4 p-4">
	<div
		class="rounded-md bg-amber-50 p-2.5 text-xs text-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
	>
		Raw block allows injecting custom HTML or MJML directly into the email canvas.
	</div>

	<FormField label="Raw HTML / Snippet">
		<Textarea
			bind:value={block.content}
			oninput={studio.onTemplateChanged}
			rows={10}
			class="font-mono text-xs"
			size="sm"
		/>
	</FormField>
</div>
