<!-- src/lib/components/BlockPalette.svelte -->
<script lang="ts">
	import { BLOCK_DEFINITIONS } from '$lib/constants/blocks';
	import { studio } from '$lib/stores/studio.svelte';
	import { FileText, MousePointerClick, Image, Minus, MoveVertical } from '@lucide/svelte';

	const paletteItems = Object.values(BLOCK_DEFINITIONS);

	function getLucideIcon(type: string) {
		switch (type) {
			case 'text':
				return FileText;
			case 'button':
				return MousePointerClick;
			case 'image':
				return Image;
			case 'divider':
				return Minus;
			case 'spacer':
				return MoveVertical;
			default:
				return FileText;
		}
	}
</script>

<div class="space-y-4 text-sm">
	<div class="text-sm font-bold tracking-wider text-neutral-600 dark:text-neutral-400 uppercase">Add Content</div>
	<div class="grid grid-cols-1 gap-2.5">
		{#each paletteItems as item (item.type)}
			{@const IconComponent = getLucideIcon(item.type)}
			<button
				type="button"
				class="flex w-full cursor-pointer items-center gap-3 rounded-lg border border-neutral-200 bg-white p-3 text-left transition hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/60 dark:hover:border-neutral-700 dark:hover:bg-neutral-800"
				onclick={() => studio.addBlock(item.factory)}
			>
				<div
					class="bg-primary-100 text-primary-700 dark:bg-primary-950 dark:text-primary-400 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
				>
					<IconComponent class="h-4.5 w-4.5" />
				</div>
				<div>
					<div class="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{item.label}</div>
				</div>
			</button>
		{/each}
	</div>
</div>
