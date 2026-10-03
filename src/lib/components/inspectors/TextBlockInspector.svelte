<!-- src/lib/components/inspectors/TextBlockInspector.svelte -->
<script lang="ts">
	import { studio } from '#lib/stores/studio.svelte.js';
	import type { TextBlock } from '#lib/types/email.js';
	import { FormField, ToggleGroup, Button, Textarea } from 'yaxa-svelte';
	import {
		AlignLeft,
		AlignCenter,
		AlignRight,
		Bold,
		Italic,
		Link as LinkIcon,
		Heading2,
		Code
	} from '@lucide/svelte';

	let { block = $bindable() }: { block: TextBlock } = $props();

	const alignOptions = [
		{ value: 'left', label: 'Left', icon: AlignLeft },
		{ value: 'center', label: 'Center', icon: AlignCenter },
		{ value: 'right', label: 'Right', icon: AlignRight }
	];

	function insertTextSnippet(snippet: string) {
		block.content = (block.content || '') + snippet;
		studio.onTemplateChanged();
	}
</script>

<div class="space-y-4 p-4">
	<FormField label="Text Alignment">
		<ToggleGroup
			items={alignOptions}
			bind:value={block.align}
			onchange={studio.onTemplateChanged}
			size="sm"
			variant="outline"
			block
		/>
	</FormField>

	<div class="space-y-1.5">
		<span class="text-xs font-semibold text-neutral-600 dark:text-neutral-400">Quick Insert</span>
		<div class="flex flex-wrap gap-1">
			<Button
				size="xs"
				color="neutral"
				variant="subtle"
				onclick={() => insertTextSnippet('<strong>Bold text</strong>')}
			>
				<Bold class="mr-1 h-3 w-3" />
				Bold
			</Button>
			<Button
				size="xs"
				color="neutral"
				variant="subtle"
				onclick={() => insertTextSnippet('<em>Italic text</em>')}
			>
				<Italic class="mr-1 h-3 w-3" />
				Italic
			</Button>
			<Button
				size="xs"
				color="neutral"
				variant="subtle"
				onclick={() =>
					insertTextSnippet(
						'<a href="https://" style="color:#0284c7;text-decoration:underline;">Link</a>'
					)}
			>
				<LinkIcon class="mr-1 h-3 w-3" />
				Link
			</Button>
			<Button
				size="xs"
				color="neutral"
				variant="subtle"
				onclick={() =>
					insertTextSnippet(
						'<h2 style="font-size:20px;font-weight:bold;margin-bottom:8px;">Heading</h2>'
					)}
			>
				<Heading2 class="mr-1 h-3 w-3" />
				H2
			</Button>
			<Button
				size="xs"
				color="primary"
				variant="subtle"
				onclick={() => insertTextSnippet('{{ user.name }}')}
			>
				<Code class="mr-1 h-3 w-3" />
				&#123;&#123; tag &#125;&#125;
			</Button>
		</div>
	</div>

	<FormField label="HTML / Content">
		<Textarea
			bind:value={block.content}
			oninput={studio.onTemplateChanged}
			rows={8}
			class="font-mono text-sm"
			size="sm"
		/>
	</FormField>
</div>
