<!-- src/lib/components/inspectors/ImageBlockInspector.svelte -->
<script lang="ts">
	import { studio } from '#lib/stores/studio.svelte.js';
	import type { ImageBlock } from '#lib/types/email.js';
	import { FormField, Input, ToggleGroup } from 'yaxa-svelte';
	import ImageUploader from '#lib/components/ImageUploader.svelte';
	import { AlignLeft, AlignCenter, AlignRight } from '@lucide/svelte';

	let { block = $bindable() }: { block: ImageBlock } = $props();

	const alignOptions = [
		{ value: 'left', label: 'Left', icon: AlignLeft },
		{ value: 'center', label: 'Center', icon: AlignCenter },
		{ value: 'right', label: 'Right', icon: AlignRight }
	];
</script>

<div class="space-y-4 p-4">
	<ImageUploader bind:src={block.src} />

	<FormField label="Alt Description">
		<Input bind:value={block.alt} oninput={studio.onTemplateChanged} size="sm" />
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
		<FormField label="Width">
			<Input
				bind:value={block.width}
				oninput={studio.onTemplateChanged}
				placeholder="auto or 100%"
				size="sm"
			/>
		</FormField>
		<FormField label="Click Link URL">
			<Input
				bind:value={block.href}
				oninput={studio.onTemplateChanged}
				placeholder="https://"
				size="sm"
			/>
		</FormField>
	</div>
</div>
