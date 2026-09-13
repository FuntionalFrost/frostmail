<!-- src/lib/components/LayersTree.svelte -->
<script lang="ts">
	import { studio } from '$lib/stores/studio.svelte';
	import type { ContentBlock } from '$lib/types/email';
	import { Button } from 'yaxa-svelte';
	import {
		Layers,
		ChevronUp,
		ChevronDown,
		Copy,
		Trash2,
		FileText,
		MousePointerClick,
		Image,
		Minus,
		MoveVertical,
		Plus
	} from '@lucide/svelte';

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
	<div class="flex items-center justify-between">
		<div class="text-sm font-bold tracking-wider text-neutral-600 dark:text-neutral-400 uppercase">
			Structure ({studio.template.body?.length || 0})
		</div>
		<Button size="sm" color="primary" variant="subtle" onclick={studio.addSection}>
			<Plus class="mr-1 h-3.5 w-3.5" />
			Add Section
		</Button>
	</div>

	{#if !studio.template.body || studio.template.body.length === 0}
		<div class="text-sm text-neutral-500 italic">No sections added yet.</div>
	{/if}

	{#each studio.template.body || [] as section, sIndex (section.id)}
		{@const isSectionSelected = studio.selectedBlockId === section.id}
		<div
			class="space-y-2.5 rounded-lg border p-3 transition {isSectionSelected
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
					<Layers class="text-primary-500 h-4.5 w-4.5" />
					<span class="text-sm font-bold">Section {sIndex + 1}</span>
					<span class="font-mono text-sm font-normal text-neutral-500 dark:text-neutral-400">
						({section.children?.[0]?.children?.length || 0} items)
					</span>
				</div>

				<div class="flex items-center gap-0.5 opacity-0 transition group-hover:opacity-100">
					<Button
						variant="ghost"
						color="neutral"
						size="sm"
						disabled={sIndex === 0}
						aria-label="Move Section Up"
						onclick={(e) => {
							e.stopPropagation();
							studio.moveSection('up', section.id);
						}}
					>
						<ChevronUp class="h-4 w-4" />
					</Button>
					<Button
						variant="ghost"
						color="neutral"
						size="sm"
						disabled={sIndex === (studio.template.body?.length || 0) - 1}
						aria-label="Move Section Down"
						onclick={(e) => {
							e.stopPropagation();
							studio.moveSection('down', section.id);
						}}
					>
						<ChevronDown class="h-4 w-4" />
					</Button>
					<Button
						variant="ghost"
						color="neutral"
						size="sm"
						aria-label="Duplicate Section"
						onclick={(e) => {
							e.stopPropagation();
							studio.duplicateSection(section.id);
						}}
					>
						<Copy class="h-4 w-4" />
					</Button>
					<Button
						variant="ghost"
						color="error"
						size="sm"
						aria-label="Remove Section"
						onclick={(e) => {
							e.stopPropagation();
							studio.removeSection(section.id);
						}}
					>
						<Trash2 class="h-4 w-4" />
					</Button>
				</div>
			</div>

			<!-- Blocks List inside Section -->
			<div class="space-y-1.5">
				{#each (section.children?.[0]?.children as ContentBlock[]) || [] as block, bIndex (block.id)}
					{@const isBlockSelected = studio.selectedBlockId === block.id}
					{@const BlockIcon = getLucideIcon(block.type)}
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div
						class="group flex cursor-pointer items-center justify-between rounded-md border p-2 text-sm transition {isBlockSelected
							? 'border-primary-500/60 bg-primary-50 text-primary-800 dark:bg-primary-950/50 dark:text-primary-300 font-semibold'
							: 'border-transparent text-neutral-800 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800'}"
						onclick={() => studio.selectBlock(block.id)}
					>
						<div class="flex items-center gap-2.5 truncate">
							<BlockIcon class="h-4.5 w-4.5 shrink-0" />
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
								size="sm"
								disabled={bIndex === 0}
								aria-label="Move Block Up"
								onclick={(e) => {
									e.stopPropagation();
									studio.moveBlock('up', block.id);
								}}
							>
								<ChevronUp class="h-4 w-4" />
							</Button>
							<Button
								variant="ghost"
								color="neutral"
								size="sm"
								disabled={bIndex === (section.children?.[0]?.children?.length ?? 0) - 1}
								aria-label="Move Block Down"
								onclick={(e) => {
									e.stopPropagation();
									studio.moveBlock('down', block.id);
								}}
							>
								<ChevronDown class="h-4 w-4" />
							</Button>
							<Button
								variant="ghost"
								color="neutral"
								size="sm"
								aria-label="Duplicate Block"
								onclick={(e) => {
									e.stopPropagation();
									studio.duplicateBlock(block.id);
								}}
							>
								<Copy class="h-4 w-4" />
							</Button>
							<Button
								variant="ghost"
								color="error"
								size="sm"
								aria-label="Remove Block"
								onclick={(e) => {
									e.stopPropagation();
									studio.removeBlock(block.id);
								}}
							>
								<Trash2 class="h-4 w-4" />
							</Button>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/each}
</div>
