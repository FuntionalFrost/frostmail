<!-- src/lib/components/InspectorPanel.svelte -->
<script lang="ts">
	import { studio } from '$lib/stores/studio.svelte';
	import { BLOCK_REGISTRY } from '$lib/blocks';
	import type { SectionBlock, ColumnBlock } from '$lib/types/email';
	import { Button } from 'yaxa-svelte';
	import { Trash2 } from '@lucide/svelte';
	import GlobalSettingsInspector from './inspectors/GlobalSettingsInspector.svelte';
	import SectionInspector from './inspectors/SectionInspector.svelte';
	import ColumnInspector from './inspectors/ColumnInspector.svelte';

	const activePlugin = $derived.by(() => {
		if (!studio.selectedBlock) return null;
		const type = studio.selectedBlock.type;
		if (type === 'section' || type === 'column') return null;
		return BLOCK_REGISTRY[type as keyof typeof BLOCK_REGISTRY] || null;
	});

	const inspectorTitle = $derived.by(() => {
		if (!studio.selectedBlock) return 'Global Settings';
		if (studio.selectedBlock.type === 'section') return 'Section Settings';
		if (studio.selectedBlock.type === 'column') return 'Column Settings';
		return activePlugin ? `${activePlugin.label} Settings` : 'Block Settings';
	});
</script>

<div class="flex h-full flex-col bg-white text-sm dark:bg-neutral-900">
	<!-- Header -->
	<div
		class="flex items-center justify-between border-b border-neutral-200 p-3.5 dark:border-neutral-800"
	>
		<span class="text-sm font-bold text-neutral-900 dark:text-neutral-100">
			{inspectorTitle}
		</span>
		{#if studio.selectedBlock}
			<Button
				variant="ghost"
				color="error"
				size="xs"
				aria-label="Delete Selected"
				onclick={() => {
					if (studio.selectedBlockId) {
						studio.removeBlock(studio.selectedBlockId);
					}
				}}
			>
				<Trash2 class="h-4 w-4" />
			</Button>
		{/if}
	</div>

	<!-- Dynamic Inspector Form Body -->
	<div class="flex-1 overflow-y-auto">
		{#if !studio.selectedBlock}
			<GlobalSettingsInspector />
		{:else if studio.selectedBlock.type === 'section'}
			<SectionInspector section={studio.selectedBlock as SectionBlock} />
		{:else if studio.selectedBlock.type === 'column'}
			<ColumnInspector column={studio.selectedBlock as ColumnBlock} />
		{:else if activePlugin}
			{@const InspectorComponent = activePlugin.inspector}
			<InspectorComponent bind:block={studio.selectedBlock} />
		{:else}
			<div class="p-6 text-center text-xs text-neutral-400 italic">
				No settings available for this block.
			</div>
		{/if}
	</div>
</div>
