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

<div class="space-y-3.5 text-sm">
	<div class="text-xs font-semibold tracking-wider text-neutral-500 uppercase">Add Content</div>
	<div class="grid grid-cols-1 gap-2.5">
		{#each paletteItems as item (item.type)}
			{@const IconComponent = getLucideIcon(item.type)}
			<button
				type="button"
				class="flex w-full cursor-pointer items-center gap-3 rounded-lg border border-neutral-200 p-3 text-left transition hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/60"
				onclick={() => studio.addBlock(item.factory)}
			>
				<div
					class="bg-primary-50 text-primary-600 dark:bg-primary-950/50 dark:text-primary-400 flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
				>
					<IconComponent class="h-4 w-4" />
				</div>
				<div>
					<div class="font-medium text-neutral-800 dark:text-neutral-100">{item.label}</div>
				</div>
			</button>
		{/each}
	</div>
</div>
