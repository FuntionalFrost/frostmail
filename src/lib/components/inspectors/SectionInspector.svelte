<!-- src/lib/components/inspectors/SectionInspector.svelte -->
<script lang="ts">
	import { studio } from '#lib/stores/studio.svelte.js';
	import type { SectionBlock } from '#lib/types/email.js';
	import { FormField, Input, ColorPicker, Button } from 'yaxa-svelte';
	import { Plus, Trash2, Copy } from '@lucide/svelte';

	let { section }: { section: SectionBlock } = $props();
</script>

<div class="space-y-4 p-4">
	<FormField label="Section Background Color">
		<ColorPicker bind:value={section.backgroundColor} class="w-full" />
	</FormField>

	<FormField label="Section Padding">
		<Input
			bind:value={section.padding}
			oninput={studio.onTemplateChanged}
			placeholder="20px 0px"
			size="sm"
		/>
	</FormField>

	<div class="space-y-2 pt-2">
		<div
			class="text-xs font-semibold tracking-wider text-neutral-500 uppercase dark:text-neutral-400"
		>
			Columns ({section.children?.length || 0})
		</div>

		<Button
			size="sm"
			color="neutral"
			variant="outline"
			class="w-full"
			onclick={() => studio.addColumnToSection(section.id)}
		>
			<Plus class="mr-1.5 h-3.5 w-3.5" />
			Add Column to Section
		</Button>
	</div>

	<div class="flex items-center gap-2 border-t border-neutral-200 pt-4 dark:border-neutral-800">
		<Button
			size="sm"
			color="neutral"
			variant="subtle"
			class="flex-1"
			onclick={() => studio.duplicateSection(section.id)}
		>
			<Copy class="mr-1.5 h-3.5 w-3.5" />
			Duplicate
		</Button>
		<Button
			size="sm"
			color="error"
			variant="subtle"
			class="flex-1"
			onclick={() => studio.removeSection(section.id)}
		>
			<Trash2 class="mr-1.5 h-3.5 w-3.5" />
			Delete
		</Button>
	</div>
</div>
