<!-- src/routes/editor/+page.svelte -->
<script lang="ts">
	import { studio } from '#lib/stores/studio.svelte.js';
	import {
		useShortcuts,
		toast,
		Button,
		ButtonGroup,
		Kbd,
		Tabs,
		Seo,
		ToggleGroup
	} from 'yaxa-svelte';
	import { page } from '$app/state';
	import ThemeToggle from '#lib/components/ThemeToggle.svelte';
	import BlockPalette from '#lib/components/BlockPalette.svelte';
	import LayersTree from '#lib/components/LayersTree.svelte';
	import VariableManager from '#lib/components/VariableManager.svelte';
	import InspectorPanel from '#lib/components/InspectorPanel.svelte';
	import DeliverabilityDrawer from '#lib/components/DeliverabilityDrawer.svelte';
	import SendTestModal from '#lib/components/SendTestModal.svelte';
	import ExportModal from '#lib/components/ExportModal.svelte';
	import TemplateLibraryModal from '#lib/components/TemplateLibraryModal.svelte';
	import UpgradeModal from '#lib/components/UpgradeModal.svelte';
	import AuthModal from '#lib/components/AuthModal.svelte';

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
		LayoutGrid,
		Layers,
		Variable
	} from '@lucide/svelte';

	const sidebarTabs = [
		{ label: 'Blocks', icon: LayoutGrid, value: 'blocks' },
		{ label: 'Layers', icon: Layers, value: 'layers' },
		{ label: 'Vars', icon: Variable, value: 'variables' }
	];

	const viewportOptions = [
		{ value: 'desktop', label: 'Desktop', icon: Monitor },
		{ value: 'mobile', label: 'Mobile', icon: Smartphone }
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
		class="flex h-16 shrink-0 items-center justify-between border-b border-neutral-200 bg-white/95 px-5 shadow-xs backdrop-blur-md transition-colors duration-200 dark:border-neutral-800 dark:bg-neutral-900/95"
	>
		<!-- 1. Left: Brand & Template Library Trigger -->
		<div class="flex items-center gap-3">
			<a href="/" class="mr-1 text-lg font-bold tracking-tight hover:opacity-80"> FrostMail </a>

			<Button size="sm" color="neutral" variant="subtle" onclick={() => (isLibraryOpen = true)}>
				<Folder class="mr-1.5 h-4 w-4 text-neutral-600 dark:text-neutral-400" />
				<span class="max-w-36 truncate text-sm font-medium">{studio.activeProjectName}</span>
				<ChevronDown class="ml-1.5 h-3.5 w-3.5 opacity-70" />
			</Button>

			<span
				class="ml-1 flex items-center gap-1.5 text-sm font-medium text-neutral-600 dark:text-neutral-400"
			>
				{#if studio.isSaved}
					<CheckCircle2 class="h-4.5 w-4.5 text-emerald-500" />
					Saved
				{:else}
					<RotateCw class="text-primary-500 h-4.5 w-4.5 animate-spin" />
					Saving...
				{/if}
			</span>
		</div>

		<!-- 2. Center: Viewport & Dark Mode Simulation Controls -->
		<div class="flex items-center gap-2.5">
			<ToggleGroup
				items={viewportOptions}
				bind:value={studio.previewMode}
				size="sm"
				variant="outline"
			/>

			<Button
				variant={studio.simulateDarkMode ? 'solid' : 'outline'}
				color={studio.simulateDarkMode ? 'primary' : 'neutral'}
				size="sm"
				aria-label="Simulate Email Client Dark Mode"
				onclick={() => (studio.simulateDarkMode = !studio.simulateDarkMode)}
			>
				<Moon class="h-4 w-4" />
			</Button>

			<div class="mx-1 h-5 w-px bg-neutral-300 dark:bg-neutral-700"></div>

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

		<!-- 3. Right: Deliverability, Actions, Utilities -->
		<div class="flex items-center gap-2">
			<DeliverabilityDrawer />

			<a href="/diagnostic">
				<Button size="sm" color="neutral" variant="ghost">
					<ShieldCheck class="mr-1.5 h-4 w-4" />
					DNS Auditor
				</Button>
			</a>

			<div class="mx-0.5 h-5 w-px bg-neutral-200 dark:bg-neutral-800"></div>

			<Button size="sm" color="neutral" variant="outline" onclick={() => (isExportOpen = true)}>
				<Code class="mr-1.5 h-4 w-4" />
				Export
			</Button>

			<Button size="sm" color="primary" onclick={() => (isTestSendOpen = true)}>
				<Send class="mr-1.5 h-4 w-4" />
				Send Test
			</Button>

			<div class="mx-0.5 h-5 w-px bg-neutral-200 dark:bg-neutral-800"></div>

			<!-- Pro Upgrade & Account Profile -->
			<Button size="sm" color="primary" variant="subtle" onclick={() => (isUpgradeOpen = true)}>
				<Sparkles class="mr-1 h-3.5 w-3.5" />
				Pro
			</Button>

			<Button size="sm" color="neutral" variant="outline" onclick={() => (isAuthOpen = true)}>
				<User class="mr-1.5 h-4 w-4" />
				Account
			</Button>

			<ThemeToggle />
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
				class="shrink-0 border-b border-neutral-200 bg-neutral-50/80 p-3 dark:border-neutral-800 dark:bg-neutral-900/80"
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
				class="h-[90vh] overflow-hidden rounded-xl border border-neutral-300 shadow-2xl transition-all duration-300 dark:border-neutral-800 {studio.simulateDarkMode
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
		class="fixed bottom-3 left-1/2 hidden -translate-x-1/2 items-center gap-3.5 rounded-full border border-neutral-300 bg-white/95 px-5 py-2 text-sm font-medium text-neutral-700 shadow-lg backdrop-blur md:flex dark:border-neutral-700 dark:bg-neutral-900/95 dark:text-neutral-200"
	>
		<span class="flex items-center gap-1.5"><Kbd size="sm" value="⌘Z" /> Undo</span>
		<span class="text-neutral-400 dark:text-neutral-600">&bull;</span>
		<span class="flex items-center gap-1.5"><Kbd size="sm" value="⌘Y" /> Redo</span>
		<span class="text-neutral-400 dark:text-neutral-600">&bull;</span>
		<span class="flex items-center gap-1.5"><Kbd size="sm" value="Esc" /> Deselect</span>
	</div>
</div>
