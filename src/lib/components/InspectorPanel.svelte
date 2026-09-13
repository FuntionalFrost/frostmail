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
	import { Button, FormField, Input, Select, Textarea } from 'yaxa-svelte';
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
					<Input
						bind:value={studio.template.globalStyles.backgroundColor}
						oninput={studio.onTemplateChanged}
						size="sm"
					/>
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
				<Input
					bind:value={section.backgroundColor}
					oninput={studio.onTemplateChanged}
					placeholder="#ffffff or transparent"
					size="sm"
				/>
			</FormField>

			<!-- Text Block -->
		{:else if studio.selectedBlock.type === 'text'}
			{@const textBlock = studio.selectedBlock as TextBlock}
			<FormField label="Text Alignment">
				<div class="flex items-center gap-1.5">
					<Button
						variant={textBlock.align === 'left' ? 'solid' : 'outline'}
						color={textBlock.align === 'left' ? 'primary' : 'neutral'}
						size="sm"
						aria-label="Align Left"
						onclick={() => {
							textBlock.align = 'left';
							studio.onTemplateChanged();
						}}
					>
						<AlignLeft class="h-3.5 w-3.5" />
					</Button>
					<Button
						variant={textBlock.align === 'center' ? 'solid' : 'outline'}
						color={textBlock.align === 'center' ? 'primary' : 'neutral'}
						size="sm"
						aria-label="Align Center"
						onclick={() => {
							textBlock.align = 'center';
							studio.onTemplateChanged();
						}}
					>
						<AlignCenter class="h-3.5 w-3.5" />
					</Button>
					<Button
						variant={textBlock.align === 'right' ? 'solid' : 'outline'}
						color={textBlock.align === 'right' ? 'primary' : 'neutral'}
						size="sm"
						aria-label="Align Right"
						onclick={() => {
							textBlock.align = 'right';
							studio.onTemplateChanged();
						}}
					>
						<AlignRight class="h-3.5 w-3.5" />
					</Button>
				</div>
			</FormField>

			<div class="space-y-1.5">
				<span class="text-xs font-semibold text-neutral-500 dark:text-neutral-400"
					>Quick Insert</span
				>
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
				<div class="flex items-center gap-1.5">
					<Button
						variant={(buttonBlock.align || 'center') === 'left' ? 'solid' : 'outline'}
						color={(buttonBlock.align || 'center') === 'left' ? 'primary' : 'neutral'}
						size="sm"
						aria-label="Align Left"
						onclick={() => {
							buttonBlock.align = 'left';
							studio.onTemplateChanged();
						}}
					>
						<AlignLeft class="h-3.5 w-3.5" />
					</Button>
					<Button
						variant={(buttonBlock.align || 'center') === 'center' ? 'solid' : 'outline'}
						color={(buttonBlock.align || 'center') === 'center' ? 'primary' : 'neutral'}
						size="sm"
						aria-label="Align Center"
						onclick={() => {
							buttonBlock.align = 'center';
							studio.onTemplateChanged();
						}}
					>
						<AlignCenter class="h-3.5 w-3.5" />
					</Button>
					<Button
						variant={(buttonBlock.align || 'center') === 'right' ? 'solid' : 'outline'}
						color={(buttonBlock.align || 'center') === 'right' ? 'primary' : 'neutral'}
						size="sm"
						aria-label="Align Right"
						onclick={() => {
							buttonBlock.align = 'right';
							studio.onTemplateChanged();
						}}
					>
						<AlignRight class="h-3.5 w-3.5" />
					</Button>
				</div>
			</FormField>

			<div class="grid grid-cols-2 gap-2.5">
				<FormField label="Button Color">
					<Input
						bind:value={buttonBlock.backgroundColor}
						oninput={studio.onTemplateChanged}
						size="sm"
					/>
				</FormField>
				<FormField label="Text Color">
					<Input bind:value={buttonBlock.color} oninput={studio.onTemplateChanged} size="sm" />
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
				<div class="flex items-center gap-1.5">
					<Button
						variant={(imgBlock.align || 'center') === 'left' ? 'solid' : 'outline'}
						color={(imgBlock.align || 'center') === 'left' ? 'primary' : 'neutral'}
						size="sm"
						aria-label="Align Left"
						onclick={() => {
							imgBlock.align = 'left';
							studio.onTemplateChanged();
						}}
					>
						<AlignLeft class="h-3.5 w-3.5" />
					</Button>
					<Button
						variant={(imgBlock.align || 'center') === 'center' ? 'solid' : 'outline'}
						color={(imgBlock.align || 'center') === 'center' ? 'primary' : 'neutral'}
						size="sm"
						aria-label="Align Center"
						onclick={() => {
							imgBlock.align = 'center';
							studio.onTemplateChanged();
						}}
					>
						<AlignCenter class="h-3.5 w-3.5" />
					</Button>
					<Button
						variant={(imgBlock.align || 'center') === 'right' ? 'solid' : 'outline'}
						color={(imgBlock.align || 'center') === 'right' ? 'primary' : 'neutral'}
						size="sm"
						aria-label="Align Right"
						onclick={() => {
							imgBlock.align = 'right';
							studio.onTemplateChanged();
						}}
					>
						<AlignRight class="h-3.5 w-3.5" />
					</Button>
				</div>
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
				<span class="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Presets</span>
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
