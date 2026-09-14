<!-- src/lib/components/InspectorPanel.svelte -->
<script lang="ts">
	import { studio } from '$lib/stores/studio.svelte';
	import type {
		TextBlock,
		ButtonBlock,
		ImageBlock,
		SpacerBlock,
		SectionBlock
	} from '$lib/types/email';
	import { EMAIL_SAFE_FONTS } from '$lib/constants/blocks';
	import {
		Button,
		FormField,
		Input,
		Select,
		Textarea,
		ColorPicker,
		ToggleGroup
	} from 'yaxa-svelte';
	import ImageUploader from './ImageUploader.svelte';
	import {
		Trash2,
		AlignLeft,
		AlignCenter,
		AlignRight,
		Bold,
		Italic,
		Link as LinkIcon,
		Heading2,
		Code
	} from '@lucide/svelte';

	const alignOptions = [
		{ value: 'left', label: 'Left', icon: AlignLeft },
		{ value: 'center', label: 'Center', icon: AlignCenter },
		{ value: 'right', label: 'Right', icon: AlignRight }
	];

	const spacerPresets = ['12px', '24px', '36px', '48px', '64px'];

	function insertTextSnippet(snippet: string) {
		if (!studio.selectedBlock || studio.selectedBlock.type !== 'text') return;
		const block = studio.selectedBlock as TextBlock;
		block.content = (block.content || '') + snippet;
		studio.onTemplateChanged();
	}

	const fontOptions = EMAIL_SAFE_FONTS.map((f) => ({ value: f.value, label: f.label }));
</script>

<div class="flex h-full flex-col bg-white text-sm dark:bg-neutral-900">
	<!-- Header -->
	<div
		class="flex items-center justify-between border-b border-neutral-200 p-3.5 dark:border-neutral-800"
	>
		<span class="text-base font-bold capitalize">
			{studio.selectedBlock ? `${studio.selectedBlock.type} Properties` : 'Global Settings'}
		</span>
		{#if studio.selectedBlock}
			<Button
				variant="ghost"
				color="error"
				size="sm"
				aria-label="Delete Block"
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

	<!-- Inspector Form Body -->
	<div class="flex-1 space-y-4 overflow-y-auto p-4">
		<!-- Global Email Settings -->
		{#if !studio.selectedBlock}
			<FormField label="Subject Line">
				<Input bind:value={studio.template.subject} oninput={studio.onTemplateChanged} size="sm" />
			</FormField>

			<FormField label="Preheader Preview">
				<Input
					bind:value={studio.template.preheader}
					oninput={studio.onTemplateChanged}
					size="sm"
				/>
			</FormField>

			<FormField label="Font Family">
				<Select
					bind:value={studio.template.globalStyles.fontFamily}
					options={fontOptions}
					size="sm"
				/>
			</FormField>

			<div class="grid grid-cols-2 gap-2.5">
				<FormField label="Canvas BG">
					<ColorPicker bind:value={studio.template.globalStyles.backgroundColor} class="w-full" />
				</FormField>
				<FormField label="Max Width">
					<Input
						bind:value={studio.template.globalStyles.contentWidth}
						oninput={studio.onTemplateChanged}
						size="sm"
					/>
				</FormField>
			</div>

			<!-- Section Block -->
		{:else if studio.selectedBlock.type === 'section'}
			{@const section = studio.selectedBlock as SectionBlock}
			<FormField label="Section Background Color">
				<ColorPicker bind:value={section.backgroundColor} class="w-full" />
			</FormField>

			<!-- Text Block -->
		{:else if studio.selectedBlock.type === 'text'}
			{@const textBlock = studio.selectedBlock as TextBlock}
			<FormField label="Text Alignment">
				<ToggleGroup
					items={alignOptions}
					bind:value={textBlock.align}
					onchange={() => studio.onTemplateChanged()}
					size="sm"
					variant="outline"
					block
				/>
			</FormField>

			<div class="space-y-1.5">
				<span class="text-sm font-bold text-neutral-600 dark:text-neutral-400">Quick Insert</span>
				<div class="flex flex-wrap gap-1">
					<Button
						size="sm"
						color="neutral"
						variant="subtle"
						onclick={() => insertTextSnippet('<strong>Bold text</strong>')}
					>
						<Bold class="mr-1 h-3 w-3" />
						Bold
					</Button>
					<Button
						size="sm"
						color="neutral"
						variant="subtle"
						onclick={() => insertTextSnippet('<em>Italic text</em>')}
					>
						<Italic class="mr-1 h-3 w-3" />
						Italic
					</Button>
					<Button
						size="sm"
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
						size="sm"
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
						size="sm"
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
					bind:value={textBlock.content}
					oninput={studio.onTemplateChanged}
					rows={8}
					class="font-mono text-sm"
					size="sm"
				/>
			</FormField>

			<!-- Button Block -->
		{:else if studio.selectedBlock.type === 'button'}
			{@const buttonBlock = studio.selectedBlock as ButtonBlock}
			<FormField label="Button Label">
				<Input bind:value={buttonBlock.label} oninput={studio.onTemplateChanged} size="sm" />
			</FormField>

			<FormField label="Target URL">
				<Input bind:value={buttonBlock.url} oninput={studio.onTemplateChanged} size="sm" />
			</FormField>

			<FormField label="Alignment">
				<ToggleGroup
					items={alignOptions}
					bind:value={buttonBlock.align}
					onchange={() => studio.onTemplateChanged()}
					size="sm"
					variant="outline"
					block
				/>
			</FormField>

			<div class="grid grid-cols-2 gap-2.5">
				<FormField label="Button Color">
					<ColorPicker bind:value={buttonBlock.backgroundColor} class="w-full" />
				</FormField>
				<FormField label="Text Color">
					<ColorPicker bind:value={buttonBlock.color} class="w-full" />
				</FormField>
			</div>

			<FormField label="Corner Radius">
				<Input
					bind:value={buttonBlock.borderRadius}
					oninput={studio.onTemplateChanged}
					placeholder="4px"
					size="sm"
				/>
			</FormField>

			<!-- Image Block -->
		{:else if studio.selectedBlock.type === 'image'}
			{@const imgBlock = studio.selectedBlock as ImageBlock}
			<ImageUploader bind:src={imgBlock.src} />

			<FormField label="Alt Description">
				<Input bind:value={imgBlock.alt} oninput={studio.onTemplateChanged} size="sm" />
			</FormField>

			<FormField label="Alignment">
				<ToggleGroup
					items={alignOptions}
					bind:value={imgBlock.align}
					onchange={() => studio.onTemplateChanged()}
					size="sm"
					variant="outline"
					block
				/>
			</FormField>

			<div class="grid grid-cols-2 gap-2.5">
				<FormField label="Width">
					<Input
						bind:value={imgBlock.width}
						oninput={studio.onTemplateChanged}
						placeholder="auto or 100%"
						size="sm"
					/>
				</FormField>
				<FormField label="Click Link URL">
					<Input
						bind:value={imgBlock.href}
						oninput={studio.onTemplateChanged}
						placeholder="https://"
						size="sm"
					/>
				</FormField>
			</div>

			<!-- Spacer Block -->
		{:else if studio.selectedBlock.type === 'spacer'}
			{@const spacerBlock = studio.selectedBlock as SpacerBlock}
			<FormField label="Vertical Height">
				<Input
					bind:value={spacerBlock.height}
					oninput={studio.onTemplateChanged}
					placeholder="24px"
					size="sm"
				/>
			</FormField>

			<div class="space-y-1.5">
				<span class="text-sm font-bold text-neutral-600 dark:text-neutral-400">Presets</span>
				<div class="flex flex-wrap gap-1.5">
					{#each spacerPresets as preset (preset)}
						<Button
							size="sm"
							color="neutral"
							variant="subtle"
							onclick={() => {
								spacerBlock.height = preset;
								studio.onTemplateChanged();
							}}
						>
							{preset}
						</Button>
					{/each}
				</div>
			</div>

			<!-- Divider Block -->
		{:else if studio.selectedBlock.type === 'divider'}
			<div class="py-4 text-center text-sm text-neutral-400 italic">
				Divider displays a standard horizontal rule.
			</div>
		{/if}
	</div>
</div>
