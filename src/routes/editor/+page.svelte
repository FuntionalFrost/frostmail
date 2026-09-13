<!-- src/routes/editor/+page.svelte -->
<script lang="ts">
	import { studio } from '$lib/stores/studio.svelte';
	import { useShortcuts, toast, Button, ButtonGroup, Kbd, Badge, Tabs, Seo } from 'yaxa-svelte';
	import { page } from '$app/state';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import BlockPalette from '$lib/components/BlockPalette.svelte';
	import LayersTree from '$lib/components/LayersTree.svelte';
	import VariableManager from '$lib/components/VariableManager.svelte';
	import InspectorPanel from '$lib/components/InspectorPanel.svelte';
	import DeliverabilityDrawer from '$lib/components/DeliverabilityDrawer.svelte';
	import SendTestModal from '$lib/components/SendTestModal.svelte';
	import ExportModal from '$lib/components/ExportModal.svelte';
	import TemplateLibraryModal from '$lib/components/TemplateLibraryModal.svelte';
	import UpgradeModal from '$lib/components/UpgradeModal.svelte';
	import AuthModal from '$lib/components/AuthModal.svelte';

	import {
		Folder,
		ChevronDown,
		CheckCircle2,
		RotateCw,
		Monitor,
		Smartphone,
		Moon,
		Undo2,
		Redo2,
		ShieldCheck,
		User,
		Sparkles,
		Code,
		Send,
		Plus
	} from '@lucide/svelte';

	const sidebarTabs = [
		{ label: 'Blocks', icon: 'plus-circle', value: 'blocks' },
		{ label: 'Layers', icon: 'layers', value: 'layers' },
		{ label: 'Vars', icon: 'variable', value: 'variables' }
	];

	let activeLeftTab = $state('blocks');
	let isTestSendOpen = $state(false);
	let isExportOpen = $state(false);
	let isLibraryOpen = $state(false);
	let isUpgradeOpen = $state(false);
	let isAuthOpen = $state(false);

	// In-Iframe postMessage Click-to-Select Listener & Shortcuts
	$effect(() => {
		if (page.url.searchParams.get('upgrade') === 'success') {
			toast.success('Welcome to FrostMail Pro! Your subscription is active.');
		}

		const handleIframeMessage = (event: MessageEvent) => {
			if (
				(event.data?.type === 'FROSTMAIL_BLOCK_CLICK' ||
					event.data?.type === 'PIXELMAIL_BLOCK_CLICK') &&
				event.data.blockId
			) {
				studio.selectBlock(event.data.blockId);
			}
		};

		window.addEventListener('message', handleIframeMessage);
		return () => {
			window.removeEventListener('message', handleIframeMessage);
		};
	});

	// Idiomatic useShortcuts from yaxa-svelte
	useShortcuts({
		meta_z: () => {
			if (studio.canUndo) studio.undo();
		},
		meta_y: () => {
			if (studio.canRedo) studio.redo();
		},
		meta_shift_z: () => {
			if (studio.canRedo) studio.redo();
		},
		escape: () => {
			if (studio.selectedBlockId) studio.selectBlock(null);
		},
		delete: () => {
			if (studio.selectedBlockId) studio.removeBlock(studio.selectedBlockId);
		},
		backspace: () => {
			if (studio.selectedBlockId) studio.removeBlock(studio.selectedBlockId);
		}
	});
</script>

<Seo
	title="Email Template Studio"
	description="Visual MJML email editor with real-time AST compilation, merge variables, dark mode simulation, and multi-format exports."
	ogImage={{
		title: 'Email Template Studio',
		description: 'Visual MJML email canvas with real-time compilation.',
		badge: 'FrostMail Studio'
	}}
/>

<div
	class="flex h-screen flex-col overflow-hidden bg-neutral-100 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100"
>
	<!-- Top Toolbar -->
	<header
		class="z-10 flex h-14 shrink-0 items-center justify-between border-b border-neutral-200 bg-white px-4 dark:border-neutral-800 dark:bg-neutral-900"
	>
		<!-- 1. Left: Brand & Template Library Trigger -->
		<div class="flex items-center gap-2.5">
			<a href="/" class="mr-1 text-base font-bold tracking-tight hover:opacity-80"> FrostMail </a>

			<Button size="sm" color="neutral" variant="subtle" onclick={() => (isLibraryOpen = true)}>
				<Folder class="mr-1.5 h-3.5 w-3.5" />
				<span class="max-w-36 truncate text-sm">{studio.activeProjectName}</span>
				<ChevronDown class="ml-1.5 h-3.5 w-3.5 opacity-60" />
			</Button>

			<span class="ml-1 flex items-center gap-1.5 text-xs font-medium text-neutral-400">
				{#if studio.isSaved}
					<CheckCircle2 class="h-4 w-4 text-emerald-500" />
					Saved
				{:else}
					<RotateCw class="text-primary-500 h-4 w-4 animate-spin" />
					Saving...
				{/if}
			</span>
		</div>

		<!-- 2. Center: Viewport & Dark Mode Simulation Controls -->
		<div class="flex items-center gap-2">
			<ButtonGroup>
				<Button
					variant={studio.previewMode === 'desktop' ? 'solid' : 'outline'}
					color="neutral"
					size="sm"
					aria-label="Desktop Preview"
					onclick={() => (studio.previewMode = 'desktop')}
				>
					<Monitor class="h-4 w-4" />
				</Button>
				<Button
					variant={studio.previewMode === 'mobile' ? 'solid' : 'outline'}
					color="neutral"
					size="sm"
					aria-label="Mobile Preview"
					onclick={() => (studio.previewMode = 'mobile')}
				>
					<Smartphone class="h-4 w-4" />
				</Button>
			</ButtonGroup>

			<Button
				variant={studio.simulateDarkMode ? 'solid' : 'outline'}
				color={studio.simulateDarkMode ? 'primary' : 'neutral'}
				size="sm"
				aria-label="Simulate Email Client Dark Mode"
				onclick={() => (studio.simulateDarkMode = !studio.simulateDarkMode)}
			>
				<Moon class="h-4 w-4" />
			</Button>

			<div class="mx-1 h-4 w-px bg-neutral-200 dark:bg-neutral-700"></div>

			<ButtonGroup>
				<Button
					size="sm"
					color="neutral"
					variant="outline"
					disabled={!studio.canUndo}
					aria-label="Undo"
					onclick={studio.undo}
				>
					<Undo2 class="h-4 w-4" />
				</Button>
				<Button
					size="sm"
					color="neutral"
					variant="outline"
					disabled={!studio.canRedo}
					aria-label="Redo"
					onclick={studio.redo}
				>
					<Redo2 class="h-4 w-4" />
				</Button>
			</ButtonGroup>
		</div>

		<!-- 3. Right: Size Badge, Content Health, Actions -->
		<div class="flex items-center gap-2">
			<Badge
				color={studio.isClippedInGmail ? 'error' : studio.emailSizeKb > 80 ? 'warning' : 'neutral'}
				variant="subtle"
				size="sm"
				class="cursor-default font-mono text-xs"
			>
				<span>{studio.emailSizeKb} KB</span>
				{#if studio.isClippedInGmail}
					<span class="ml-1 text-xs font-semibold">&bull; Clipped in Gmail</span>
				{/if}
			</Badge>

			<DeliverabilityDrawer />

			<a href="/diagnostic">
				<Button size="sm" color="neutral" variant="ghost">
					<ShieldCheck class="mr-1.5 h-4 w-4" />
					DNS Auditor
				</Button>
			</a>

			<ThemeToggle />

			<div class="mx-1 h-4 w-px bg-neutral-200 dark:bg-neutral-800"></div>

			<!-- User Profile / Sign In -->
			<Button size="sm" color="neutral" variant="outline" onclick={() => (isAuthOpen = true)}>
				<User class="mr-1.5 h-3.5 w-3.5" />
				Account
			</Button>

			<Button size="sm" color="primary" variant="subtle" onclick={() => (isUpgradeOpen = true)}>
				<Sparkles class="mr-1.5 h-3.5 w-3.5" />
				Pro (€19)
			</Button>

			<Button size="sm" color="neutral" variant="outline" onclick={() => (isExportOpen = true)}>
				<Code class="mr-1.5 h-3.5 w-3.5" />
				Export
			</Button>

			<Button size="sm" color="neutral" variant="subtle" onclick={() => (isTestSendOpen = true)}>
				<Send class="mr-1.5 h-3.5 w-3.5" />
				Send Test
			</Button>

			<Button size="sm" color="primary" onclick={studio.addSection}>
				<Plus class="mr-1.5 h-3.5 w-3.5" />
				Add Section
			</Button>
		</div>
	</header>

	<!-- 3-Pane Editor Layout -->
	<div class="flex flex-1 overflow-hidden">
		<!-- Left Sidebar: Palette / Layers / Variables -->
		<aside
			class="flex w-80 shrink-0 flex-col overflow-hidden border-r border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
		>
			<!-- Yaxa Tab Bar -->
			<div
				class="shrink-0 border-b border-neutral-200 bg-neutral-50/50 p-2.5 dark:border-neutral-800 dark:bg-neutral-900/50"
			>
				<Tabs items={sidebarTabs} bind:value={activeLeftTab} variant="segmented" class="w-full" />
			</div>

			<!-- Dynamic Panel Content -->
			<div class="flex-1 overflow-y-auto p-4">
				{#if activeLeftTab === 'blocks'}
					<BlockPalette />
				{:else if activeLeftTab === 'layers'}
					<LayersTree />
				{:else if activeLeftTab === 'variables'}
					<VariableManager />
				{/if}
			</div>
		</aside>

		<!-- Center Preview Canvas -->
		<main
			class="flex flex-1 items-center justify-center overflow-auto bg-neutral-100 p-6 dark:bg-neutral-950"
		>
			<div
				class="h-[90vh] overflow-hidden rounded-md shadow-xl transition-all duration-300 {studio.simulateDarkMode
					? 'bg-[#1a1a1a]'
					: 'bg-white'}"
				style:width={studio.previewMode === 'desktop' ? '640px' : '375px'}
				style:filter={studio.simulateDarkMode ? 'invert(0.9) hue-rotate(180deg)' : 'none'}
			>
				<iframe srcdoc={studio.compiledHtml} class="h-full w-full border-0" title="Email Preview"
				></iframe>
			</div>
		</main>

		<!-- Right Sidebar: Inspector Panel -->
		<aside
			class="w-80 shrink-0 overflow-hidden border-l border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
		>
			<InspectorPanel />
		</aside>
	</div>

	<!-- Modals -->
	<SendTestModal bind:open={isTestSendOpen} />
	<ExportModal bind:open={isExportOpen} />
	<TemplateLibraryModal bind:open={isLibraryOpen} />
	<UpgradeModal bind:open={isUpgradeOpen} />
	<AuthModal bind:open={isAuthOpen} />

	<!-- Floating Shortcut Hints Bar -->
	<div
		class="fixed bottom-3 left-1/2 hidden -translate-x-1/2 items-center gap-3 rounded-full border border-neutral-200/80 bg-white/90 px-4 py-1.5 text-xs text-neutral-500 shadow-md backdrop-blur md:flex dark:border-neutral-800/80 dark:bg-neutral-900/90 dark:text-neutral-400"
	>
		<span class="flex items-center gap-1"><Kbd size="xs" value="⌘Z" /> Undo</span>
		<span class="text-neutral-300 dark:text-neutral-700">&bull;</span>
		<span class="flex items-center gap-1"><Kbd size="xs" value="⌘Y" /> Redo</span>
		<span class="text-neutral-300 dark:text-neutral-700">&bull;</span>
		<span class="flex items-center gap-1"><Kbd size="xs" value="Esc" /> Deselect</span>
	</div>
</div>
