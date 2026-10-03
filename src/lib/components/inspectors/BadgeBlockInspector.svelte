<!-- src/lib/components/inspectors/BadgeBlockInspector.svelte -->
<script lang="ts">
	import { studio } from '#lib/stores/studio.svelte.js';
	import type { BadgeBlock } from '#lib/types/email.js';
	import { FormField, Input, ColorPicker, ToggleGroup } from 'yaxa-svelte';
	import { AlignLeft, AlignCenter, AlignRight } from '@lucide/svelte';

	let { block = $bindable() }: { block: BadgeBlock } = $props();

	const alignOptions = [
		{ value: 'left', label: 'Left', icon: AlignLeft },
		{ value: 'center', label: 'Center', icon: AlignCenter },
		{ value: 'right', label: 'Right', icon: AlignRight }
	];
</script>

<div class="space-y-4 p-4">
	<FormField label="Badge Text">
		<Input bind:value={block.text} oninput={studio.onTemplateChanged} size="sm" />
	</FormField>

	<FormField label="Alignment">
		<ToggleGroup
			items={alignOptions}
			bind:value={block.align}
			onchange={studio.onTemplateChanged}
			size="sm"
			variant="outline"
			block
		/>
	</FormField>

	<div class="grid grid-cols-2 gap-2.5">
		<FormField label="Background Color">
			<ColorPicker bind:value={block.backgroundColor} class="w-full" />
		</FormField>
		<FormField label="Text Color">
			<ColorPicker bind:value={block.color} class="w-full" />
		</FormField>
	</div>

	<div class="grid grid-cols-2 gap-2.5">
		<FormField label="Border Radius">
			<Input
				bind:value={block.borderRadius}
				oninput={studio.onTemplateChanged}
				placeholder="9999px"
				size="sm"
			/>
		</FormField>
		<FormField label="Font Size">
			<Input
				bind:value={block.fontSize}
				oninput={studio.onTemplateChanged}
				placeholder="12px"
				size="sm"
			/>
		</FormField>
	</div>
</div>
