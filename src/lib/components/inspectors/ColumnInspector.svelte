<!-- src/lib/components/inspectors/ColumnInspector.svelte -->
<script lang="ts">
	import { studio } from '#lib/stores/studio.svelte.js';
	import type { ColumnBlock } from '#lib/types/email.js';
	import { FormField, Input, ColorPicker, Button } from 'yaxa-svelte';
	import { Trash2 } from '@lucide/svelte';

	let { column }: { column: ColumnBlock } = $props();

	const widthPresets = ['100%', '50%', '33.33%', '66.67%', '25%', '75%'];
</script>

<div class="space-y-4 p-4">
	<FormField label="Column Width">
		<Input
			bind:value={column.width}
			oninput={studio.onTemplateChanged}
			placeholder="100%"
			size="sm"
		/>
	</FormField>

	<div class="space-y-1.5">
		<div class="text-xs font-semibold text-neutral-600 dark:text-neutral-400">Width Presets</div>
		<div class="grid grid-cols-3 gap-1.5">
			{#each widthPresets as preset (preset)}
				<Button
					size="xs"
					color={column.width === preset ? 'primary' : 'neutral'}
					variant={column.width === preset ? 'solid' : 'subtle'}
					onclick={() => {
						column.width = preset;
						studio.onTemplateChanged();
					}}
				>
					{preset}
				</Button>
			{/each}
		</div>
	</div>

	<FormField label="Column Background">
		<ColorPicker bind:value={column.backgroundColor} class="w-full" />
	</FormField>

	<FormField label="Column Padding">
		<Input
			bind:value={column.padding}
			oninput={studio.onTemplateChanged}
			placeholder="0px 10px"
			size="sm"
		/>
	</FormField>

	<div class="border-t border-neutral-200 pt-4 dark:border-neutral-800">
		<Button
			size="sm"
			color="error"
			variant="subtle"
			class="w-full"
			onclick={() => studio.removeColumn(column.id)}
		>
			<Trash2 class="mr-1.5 h-3.5 w-3.5" />
			Delete Column
		</Button>
	</div>
</div>
