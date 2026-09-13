<!-- src/lib/components/ExportModal.svelte -->
<script lang="ts">
	import { studio } from '$lib/stores/studio.svelte';
	import { templateToReactEmail } from '$lib/utils/reactEmailConverter';
	import { templateToMjml } from '$lib/utils/mjmlGenerator';
	import { Modal, Tabs, Button } from 'yaxa-svelte';
	import { Download, Copy, Check } from '@lucide/svelte';

	interface Props {
		open?: boolean;
	}

	let { open = $bindable(false) }: Props = $props();

	type ExportTab = 'html' | 'react' | 'mjml' | 'json';
	let activeTab = $state<ExportTab>('html');
	let isCopied = $state(false);

	const tabs = [
		{ value: 'html', label: 'HTML' },
		{ value: 'react', label: 'React Email' },
		{ value: 'mjml', label: 'MJML' },
		{ value: 'json', label: 'JSON AST' }
	];

	let currentContent = $derived.by(() => {
		switch (activeTab) {
			case 'html':
				return studio.compiledHtml;
			case 'react':
				return templateToReactEmail(studio.template);
			case 'mjml':
				return templateToMjml(studio.template, { forCanvas: false });
			case 'json':
				return JSON.stringify(studio.template, null, 2);
			default:
				return '';
		}
	});

	let payloadSizeKb = $derived.by(() => {
		const bytes = new TextEncoder().encode(currentContent).length;
		return (bytes / 1024).toFixed(2);
	});

	async function copyContent() {
		await navigator.clipboard.writeText(currentContent);
		isCopied = true;
		setTimeout(() => {
			isCopied = false;
		}, 2000);
	}

	function downloadFile() {
		const extMap: Record<ExportTab, string> = {
			html: 'html',
			react: 'tsx',
			mjml: 'mjml',
			json: 'json'
		};

		const mimeMap: Record<ExportTab, string> = {
			html: 'text/html',
			react: 'text/typescript',
			mjml: 'text/plain',
			json: 'application/json'
		};

		const ext = extMap[activeTab];
		const blob = new Blob([currentContent], { type: mimeMap[activeTab] });
		const url = URL.createObjectURL(blob);

		const a = document.createElement('a');
		a.href = url;
		a.download = `${studio.template.name.toLowerCase().replace(/\s+/g, '-') || 'email'}.${ext}`;
		a.click();
		URL.revokeObjectURL(url);
	}
</script>

<Modal
	bind:open
	title="Export Template"
	description="Export production-ready markup across multiple formats."
	size="xl"
>
	<div class="space-y-4">
		<div class="flex items-center justify-end">
			<div class="w-full sm:w-96">
				<!-- @ts-expect-error Tabs bound value type -->
				<Tabs items={tabs} bind:value={activeTab} variant="segmented" />
			</div>
		</div>

		<div class="relative">
			<textarea
				value={currentContent}
				readonly
				rows={14}
				class="w-full rounded-lg border border-neutral-200 bg-neutral-50 p-3.5 font-mono text-sm text-neutral-800 focus:outline-none dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200"
			></textarea>
		</div>

		<div class="flex items-center justify-between pt-2">
			<div class="font-mono text-sm text-neutral-500">
				Payload size: {payloadSizeKb} KB
			</div>
			<div class="flex gap-2">
				<Button color="neutral" variant="outline" size="sm" onclick={downloadFile}>
					<Download class="mr-1.5 h-3.5 w-3.5" />
					Download .{activeTab === 'react' ? 'tsx' : activeTab}
				</Button>
				<Button color="primary" size="sm" onclick={copyContent}>
					{#if isCopied}
						<Check class="mr-1.5 h-3.5 w-3.5" />
						Copied!
					{:else}
						<Copy class="mr-1.5 h-3.5 w-3.5" />
						Copy Code
					{/if}
				</Button>
			</div>
		</div>
	</div>
</Modal>
