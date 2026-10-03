<!-- src/lib/components/inspectors/ButtonBlockInspector.svelte -->
<script lang="ts">
	import { studio } from '$lib/stores/studio.svelte';
	import type { ButtonBlock } from '$lib/types/email';
	import { FormField, Input, ColorPicker, ToggleGroup } from 'yaxa-svelte';
	import { AlignLeft, AlignCenter, AlignRight } from '@lucide/svelte';

	let { block = $bindable() }: { block: ButtonBlock } = $props();

	const alignOptions = [
		{ value: 'left', label: 'Left', icon: AlignLeft },
		{ value: 'center', label: 'Center', icon: AlignCenter },
		{ value: 'right', label: 'Right', icon: AlignRight }
	];
</script>

<div class="space-y-4 p-4">
	<FormField label="Button Label">
		<Input bind:value={block.label} oninput={studio.onTemplateChanged} size="sm" />
	</FormField>

	<FormField label="Target URL">
		<Input
			bind:value={block.url}
			oninput={studio.onTemplateChanged}
			placeholder="https://"
			size="sm"
		/>
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
		<FormField label="Button Color">
			<ColorPicker bind:value={block.backgroundColor} class="w-full" />
		</FormField>
		<FormField label="Text Color">
			<ColorPicker bind:value={block.color} class="w-full" />
		</FormField>
	</div>

	<FormField label="Corner Radius">
		<Input
			bind:value={block.borderRadius}
			oninput={studio.onTemplateChanged}
			placeholder="4px"
			size="sm"
		/>
	</FormField>
</div>
