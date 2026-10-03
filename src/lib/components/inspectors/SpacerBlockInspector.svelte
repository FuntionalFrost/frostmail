<!-- src/lib/components/inspectors/SpacerBlockInspector.svelte -->
<script lang="ts">
	import { studio } from '#lib/stores/studio.svelte.js';
	import type { SpacerBlock } from '#lib/types/email.js';
	import { FormField, Input, Button } from 'yaxa-svelte';

	let { block = $bindable() }: { block: SpacerBlock } = $props();

	const spacerPresets = ['12px', '24px', '36px', '48px', '64px'];
</script>

<div class="space-y-4 p-4">
	<FormField label="Vertical Height">
		<Input
			bind:value={block.height}
			oninput={studio.onTemplateChanged}
			placeholder="24px"
			size="sm"
		/>
	</FormField>

	<div class="space-y-1.5">
		<span class="text-xs font-semibold text-neutral-600 dark:text-neutral-400">Presets</span>
		<div class="flex flex-wrap gap-1.5">
			{#each spacerPresets as preset (preset)}
				<Button
					size="xs"
					color={block.height === preset ? 'primary' : 'neutral'}
					variant={block.height === preset ? 'solid' : 'subtle'}
					onclick={() => {
						block.height = preset;
						studio.onTemplateChanged();
					}}
				>
					{preset}
				</Button>
			{/each}
		</div>
	</div>
</div>
