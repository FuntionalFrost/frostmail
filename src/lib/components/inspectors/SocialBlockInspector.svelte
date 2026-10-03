<!-- src/lib/components/inspectors/SocialBlockInspector.svelte -->
<script lang="ts">
	import { studio } from '$lib/stores/studio.svelte';
	import type { SocialBlock, SocialNetworkItem } from '$lib/types/email';
	import { FormField, Input, Select, ToggleGroup, Button } from 'yaxa-svelte';
	import { AlignLeft, AlignCenter, AlignRight, Plus, Trash2 } from '@lucide/svelte';

	let { block = $bindable() }: { block: SocialBlock } = $props();

	const alignOptions = [
		{ value: 'left', label: 'Left', icon: AlignLeft },
		{ value: 'center', label: 'Center', icon: AlignCenter },
		{ value: 'right', label: 'Right', icon: AlignRight }
	];

	const networkOptions = [
		{ value: 'x', label: 'X (Twitter)' },
		{ value: 'github', label: 'GitHub' },
		{ value: 'linkedin', label: 'LinkedIn' },
		{ value: 'facebook', label: 'Facebook' },
		{ value: 'instagram', label: 'Instagram' },
		{ value: 'youtube', label: 'YouTube' },
		{ value: 'web', label: 'Website / Link' }
	];

	function addNetwork() {
		if (!block.networks) block.networks = [];
		const newItem: SocialNetworkItem = {
			id: `soc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
			network: 'x',
			url: 'https://x.com'
		};
		block.networks.push(newItem);
		studio.onTemplateChanged();
	}

	function removeNetwork(index: number) {
		block.networks.splice(index, 1);
		studio.onTemplateChanged();
	}
</script>

<div class="space-y-4 p-4">
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
		<FormField label="Icon Size">
			<Input
				bind:value={block.iconSize}
				oninput={studio.onTemplateChanged}
				placeholder="24px"
				size="sm"
			/>
		</FormField>
		<FormField label="Icon Spacing">
			<Input
				bind:value={block.innerPadding}
				oninput={studio.onTemplateChanged}
				placeholder="4px"
				size="sm"
			/>
		</FormField>
	</div>

	<div class="space-y-3 pt-2">
		<div class="flex items-center justify-between">
			<span
				class="text-xs font-semibold tracking-wider text-neutral-500 uppercase dark:text-neutral-400"
			>
				Social Links ({block.networks?.length || 0})
			</span>
			<Button size="xs" color="primary" variant="subtle" onclick={addNetwork}>
				<Plus class="mr-1 h-3 w-3" />
				Add Link
			</Button>
		</div>

		<div class="space-y-2.5">
			{#each block.networks || [] as item, index (item.id || index)}
				<div
					class="flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50/60 p-2.5 dark:border-neutral-800 dark:bg-neutral-900/60"
				>
					<div class="flex-1 space-y-1.5">
						<Select
							bind:value={item.network}
							onchange={studio.onTemplateChanged}
							options={networkOptions}
							size="sm"
						/>
						<Input
							bind:value={item.url}
							oninput={studio.onTemplateChanged}
							placeholder="https://"
							size="xs"
						/>
					</div>
					<Button
						variant="ghost"
						color="error"
						size="xs"
						aria-label="Remove Social Link"
						onclick={() => removeNetwork(index)}
					>
						<Trash2 class="h-3.5 w-3.5" />
					</Button>
				</div>
			{/each}
		</div>
	</div>
</div>
