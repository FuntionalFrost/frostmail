<!-- src/lib/components/LayersTree.svelte -->
<script lang="ts">
	import { studio } from '$lib/stores/studio.svelte';
	import { BLOCK_REGISTRY } from '$lib/blocks';
	import type { ContentBlock } from '$lib/types/email';
	import { Button } from 'yaxa-svelte';
	import {
		Layers,
		Columns,
		ChevronUp,
		ChevronDown,
		Copy,
		Trash2,
		Plus,
		FileText
	} from '@lucide/svelte';

	function getBlockIcon(type: string) {
		const plugin = BLOCK_REGISTRY[type as keyof typeof BLOCK_REGISTRY];
		return plugin ? plugin.icon : FileText;
	}
</script>

<div class="space-y-4 text-sm">
	<div class="flex items-center justify-between">
		<div class="text-xs font-bold tracking-wider text-neutral-500 uppercase dark:text-neutral-400">
			Structure ({studio.template.body?.length || 0})
		</div>
		<Button size="xs" color="primary" variant="subtle" onclick={studio.addSection}>
			<Plus class="mr-1 h-3.5 w-3.5" />
			Add Section
		</Button>
	</div>

	{#if !studio.template.body || studio.template.body.length === 0}
		<div class="text-xs text-neutral-500 italic">No sections added yet.</div>
	{/if}

	<div class="space-y-3">
		{#each studio.template.body || [] as section, sIndex (section.id)}
			{@const isSectionSelected = studio.selectedBlockId === section.id}
			<div
				class="space-y-2 rounded-lg border p-2.5 transition {isSectionSelected
					? 'border-primary-500 bg-primary-50/40 dark:bg-primary-950/30'
					: 'border-neutral-200 bg-neutral-50/50 dark:border-neutral-800 dark:bg-neutral-900/50'}"
			>
				<!-- Section Header -->
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div
					class="group flex cursor-pointer items-center justify-between font-semibold text-neutral-800 dark:text-neutral-100"
					onclick={() => studio.selectBlock(section.id)}
				>
					<div class="flex items-center gap-2">
						<Layers class="text-primary-500 h-4 w-4" />
						<span class="text-xs font-bold">Section {sIndex + 1}</span>
						<span class="font-mono text-[11px] font-normal text-neutral-500 dark:text-neutral-400">
							({section.children?.length || 0} cols)
						</span>
					</div>

					<div class="flex items-center gap-0.5 opacity-0 transition group-hover:opacity-100">
						<Button
							variant="ghost"
							color="neutral"
							size="xs"
							disabled={sIndex === 0}
							aria-label="Move Section Up"
							onclick={(e) => {
								e.stopPropagation();
								studio.moveSection('up', section.id);
							}}
						>
							<ChevronUp class="h-3.5 w-3.5" />
						</Button>
						<Button
							variant="ghost"
							color="neutral"
							size="xs"
							disabled={sIndex === (studio.template.body?.length || 0) - 1}
							aria-label="Move Section Down"
							onclick={(e) => {
								e.stopPropagation();
								studio.moveSection('down', section.id);
							}}
						>
							<ChevronDown class="h-3.5 w-3.5" />
						</Button>
						<Button
							variant="ghost"
							color="neutral"
							size="xs"
							aria-label="Duplicate Section"
							onclick={(e) => {
								e.stopPropagation();
								studio.duplicateSection(section.id);
							}}
						>
							<Copy class="h-3.5 w-3.5" />
						</Button>
						<Button
							variant="ghost"
							color="error"
							size="xs"
							aria-label="Remove Section"
							onclick={(e) => {
								e.stopPropagation();
								studio.removeSection(section.id);
							}}
						>
							<Trash2 class="h-3.5 w-3.5" />
						</Button>
					</div>
				</div>

				<!-- Columns List inside Section -->
				<div class="space-y-2 pl-2">
					{#each section.children || [] as col, cIndex (col.id)}
						{@const isColSelected = studio.selectedBlockId === col.id}
						<div
							class="space-y-1.5 rounded-md border p-2 transition {isColSelected
								? 'border-primary-400/80 bg-white shadow-xs dark:bg-neutral-900'
								: 'border-neutral-200/80 bg-white/60 dark:border-neutral-800/80 dark:bg-neutral-900/40'}"
						>
							<!-- Column Header -->
							<!-- svelte-ignore a11y_click_events_have_key_events -->
							<!-- svelte-ignore a11y_no_static_element_interactions -->
							<div
								class="group flex cursor-pointer items-center justify-between text-xs text-neutral-700 dark:text-neutral-300"
								onclick={() => studio.selectBlock(col.id)}
							>
								<div class="flex items-center gap-1.5 font-medium">
									<Columns class="h-3.5 w-3.5 text-neutral-500" />
									<span>Col {cIndex + 1} ({col.width || '100%'})</span>
								</div>

								<div class="flex items-center gap-0.5 opacity-0 transition group-hover:opacity-100">
									<Button
										variant="ghost"
										color="error"
										size="xs"
										aria-label="Remove Column"
										onclick={(e) => {
											e.stopPropagation();
											studio.removeColumn(col.id);
										}}
									>
										<Trash2 class="h-3 w-3" />
									</Button>
								</div>
							</div>

							<!-- Content Blocks List inside Column -->
							<div class="space-y-1 pl-2">
								{#each (col.children as ContentBlock[]) || [] as block, bIndex (block.id)}
									{@const isBlockSelected = studio.selectedBlockId === block.id}
									{@const BlockIcon = getBlockIcon(block.type)}
									<!-- svelte-ignore a11y_click_events_have_key_events -->
									<!-- svelte-ignore a11y_no_static_element_interactions -->
									<div
										class="group flex cursor-pointer items-center justify-between rounded px-2 py-1 text-xs transition {isBlockSelected
											? 'bg-primary-50 text-primary-900 dark:bg-primary-950/60 dark:text-primary-300 font-semibold'
											: 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'}"
										onclick={() => studio.selectBlock(block.id)}
									>
										<div class="flex items-center gap-2 truncate">
											<BlockIcon class="h-3.5 w-3.5 shrink-0" />
											<span class="truncate capitalize">{block.type}</span>
										</div>

										<div
											class="flex items-center gap-0.5 opacity-0 transition group-hover:opacity-100 {isBlockSelected
												? 'opacity-100!'
												: ''}"
										>
											<Button
												variant="ghost"
												color="neutral"
												size="xs"
												disabled={bIndex === 0}
												aria-label="Move Block Up"
												onclick={(e) => {
													e.stopPropagation();
													studio.moveBlock('up', block.id);
												}}
											>
												<ChevronUp class="h-3 w-3" />
											</Button>
											<Button
												variant="ghost"
												color="neutral"
												size="xs"
												disabled={bIndex === (col.children?.length ?? 0) - 1}
												aria-label="Move Block Down"
												onclick={(e) => {
													e.stopPropagation();
													studio.moveBlock('down', block.id);
												}}
											>
												<ChevronDown class="h-3 w-3" />
											</Button>
											<Button
												variant="ghost"
												color="neutral"
												size="xs"
												aria-label="Duplicate Block"
												onclick={(e) => {
													e.stopPropagation();
													studio.duplicateBlock(block.id);
												}}
											>
												<Copy class="h-3 w-3" />
											</Button>
											<Button
												variant="ghost"
												color="error"
												size="xs"
												aria-label="Remove Block"
												onclick={(e) => {
													e.stopPropagation();
													studio.removeBlock(block.id);
												}}
											>
												<Trash2 class="h-3 w-3" />
											</Button>
										</div>
									</div>
								{/each}
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>
