<!-- src/lib/components/BlockPalette.svelte -->
<script lang="ts">
	import { BLOCK_REGISTRY, LAYOUT_PRESETS } from '#lib/blocks/index.js';
	import { studio } from '#lib/stores/studio.svelte.js';

	const contentBlocks = Object.values(BLOCK_REGISTRY);
</script>

<div class="space-y-6 text-sm">
	<!-- 1. Layout Presets -->
	<div class="space-y-2.5">
		<div class="text-xs font-bold tracking-wider text-neutral-500 uppercase dark:text-neutral-400">
			Layout Sections
		</div>
		<div class="grid grid-cols-1 gap-2">
			{#each LAYOUT_PRESETS as layout (layout.id)}
				{@const IconComponent = layout.icon}
				<button
					type="button"
					class="flex w-full cursor-pointer items-center gap-3 rounded-lg border border-neutral-200 bg-white p-2.5 text-left transition hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/60 dark:hover:border-neutral-700 dark:hover:bg-neutral-800"
					onclick={() => studio.addLayoutSection(layout.columns)}
				>
					<div
						class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
					>
						<IconComponent class="h-4 w-4" />
					</div>
					<div>
						<div class="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
							{layout.label}
						</div>
						<div class="text-[11px] text-neutral-500 dark:text-neutral-400">
							{layout.description}
						</div>
					</div>
				</button>
			{/each}
		</div>
	</div>

	<!-- 2. Content Blocks -->
	<div class="space-y-2.5">
		<div class="text-xs font-bold tracking-wider text-neutral-500 uppercase dark:text-neutral-400">
			Content Blocks
		</div>
		<div class="grid grid-cols-1 gap-2">
			{#each contentBlocks as item (item.type)}
				{@const IconComponent = item.icon}
				<button
					type="button"
					class="flex w-full cursor-pointer items-center gap-3 rounded-lg border border-neutral-200 bg-white p-2.5 text-left transition hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/60 dark:hover:border-neutral-700 dark:hover:bg-neutral-800"
					onclick={() => studio.addBlock(item.factory)}
				>
					<div
						class="bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-400 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
					>
						<IconComponent class="h-4 w-4" />
					</div>
					<div>
						<div class="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
							{item.label}
						</div>
					</div>
				</button>
			{/each}
		</div>
	</div>
</div>
