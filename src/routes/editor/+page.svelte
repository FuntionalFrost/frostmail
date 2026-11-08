<!-- src/routes/editor/+page.svelte -->
<script lang="ts">
	import { page } from '$app/state';
	import { studio } from '#lib/stores/studio.svelte.js';
	import { TEMPLATE_PRESETS } from '#lib/constants/presets.js';
	import {
		useShortcuts,
		Button,
		Kbd,
		Tabs,
		Seo,
		ToggleGroup,
		DropdownMenu,
		Tooltip,
		type MenuItem
	} from 'yaxa-svelte';
	import ThemeToggle from '#lib/components/ThemeToggle.svelte';
	import BlockPalette from '#lib/components/BlockPalette.svelte';
	import LayersTree from '#lib/components/LayersTree.svelte';
	import VariableManager from '#lib/components/VariableManager.svelte';
	import InspectorPanel from '#lib/components/InspectorPanel.svelte';
	import DeliverabilityDrawer from '#lib/components/DeliverabilityDrawer.svelte';
	import SendTestModal from '#lib/components/SendTestModal.svelte';
	import ExportModal from '#lib/components/ExportModal.svelte';
	import TemplateLibraryModal from '#lib/components/TemplateLibraryModal.svelte';
	import SponsorModal from '#lib/components/SponsorModal.svelte';
	import ThemeModal from '#lib/components/ThemeModal.svelte';
	import AuthModal from '#lib/components/AuthModal.svelte';

	import {
		Folder,
		ChevronDown,
		CheckCircle2,
		RotateCw,
		Monitor,
		Smartphone,
		Moon,
		User,
		Code,
		Send,
		LayoutGrid,
		Layers,
		Variable,
		MoreHorizontal,
		Settings2,
		Eye
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
	let mobilePane = $state<'canvas' | 'palette' | 'inspector'>('canvas');
	let isTestSendOpen = $state(false);
	let isExportOpen = $state(false);
	let isLibraryOpen = $state(false);
	let isSponsorOpen = $state(false);
	let isThemeOpen = $state(false);
	let isAuthOpen = $state(false);

	// Deep-link preset loading
	$effect(() => {
		const presetParam = page.url.searchParams.get('preset');
		if (presetParam && presetParam in TEMPLATE_PRESETS) {
			studio.resetToPreset(presetParam as keyof typeof TEMPLATE_PRESETS);
		}
	});

	const moreMenuItems: MenuItem[] = [
		{
			id: 'account',
			label: 'Account & Cloud Sync',
			icon: 'user',
			onSelect: () => (isAuthOpen = true)
		},
		{
			id: 'dns-auditor',
			label: 'Domain DNS Auditor',
			icon: 'shield-check',
			onSelect: () => (window.location.href = '/diagnostic')
		},
		{
			id: 'theme-studio',
			label: 'Theme Customizer',
			icon: 'palette',
			onSelect: () => (isThemeOpen = true)
		},
		{
			id: 'sponsor',
			label: 'Support FrostMail',
			icon: 'heart',
			onSelect: () => (isSponsorOpen = true)
		}
	];

	// In-Iframe postMessage Click-to-Select Listener & Shortcuts
	$effect(() => {
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
	class="flex h-screen flex-col overflow-hidden bg-neutral-100 text-neutral-900 transition-colors duration-200 dark:bg-neutral-950 dark:text-neutral-100"
>
	<!-- Top Toolbar (Responsive on mobile) -->
	<header
		class="flex h-14 shrink-0 items-center justify-between border-b border-neutral-200 bg-white/95 px-3 shadow-xs backdrop-blur-md transition-colors duration-200 sm:h-16 sm:px-5 dark:border-neutral-800 dark:bg-neutral-900/95"
	>
		<!-- 1. Left: Brand & Template Library Trigger -->
		<div class="flex items-center gap-2 sm:gap-3">
			<a href="/" class="mr-0.5 text-base font-bold tracking-tight hover:opacity-80 sm:text-lg">
				FrostMail
			</a>

			<Button size="sm" color="neutral" variant="subtle" onclick={() => (isLibraryOpen = true)}>
				<Folder
					class="mr-1 h-3.5 w-3.5 text-neutral-600 sm:mr-1.5 sm:h-4 sm:w-4 dark:text-neutral-400"
				/>
				<span class="max-w-24 truncate text-xs font-medium sm:max-w-36 sm:text-sm"
					>{studio.activeProjectName}</span
				>
				<ChevronDown class="ml-1 h-3 w-3 opacity-70 sm:ml-1.5 sm:h-3.5 sm:w-3.5" />
			</Button>

			<span
				class="ml-0.5 flex items-center gap-1 text-xs font-medium text-neutral-600 sm:text-sm dark:text-neutral-400"
			>
				{#if studio.isSaved}
					<CheckCircle2 class="h-4 w-4 text-emerald-500 sm:h-4.5 sm:w-4.5" />
					<span class="hidden md:inline">Saved</span>
				{:else}
					<RotateCw class="h-4 w-4 animate-spin text-primary-500 sm:h-4.5 sm:w-4.5" />
					<span class="hidden md:inline">Saving...</span>
				{/if}
			</span>
		</div>

		<!-- 2. Center: Viewport & Canvas Dark Mode Simulation (hidden on mobile, visible on tablet+) -->
		<div class="hidden items-center gap-1.5 md:flex">
			<ToggleGroup
				items={viewportOptions}
				bind:value={studio.previewMode}
				size="sm"
				variant="outline"
			/>

			<Tooltip text="Preview Email in Dark Mode">
				<Button
					variant={studio.simulateDarkMode ? 'solid' : 'ghost'}
					color={studio.simulateDarkMode ? 'primary' : 'neutral'}
					size="sm"
					aria-label="Simulate Email Client Dark Mode"
					onclick={() => (studio.simulateDarkMode = !studio.simulateDarkMode)}
				>
					<Moon class="h-4 w-4" />
				</Button>
			</Tooltip>
		</div>

		<!-- 3. Right: Deliverability, Primary Actions & Overflow -->
		<div class="flex items-center gap-1.5 sm:gap-2">
			<DeliverabilityDrawer />

			<div class="mx-0.5 hidden h-4 w-px bg-neutral-200 sm:block dark:bg-neutral-800"></div>

			<Button size="sm" color="neutral" variant="outline" onclick={() => (isExportOpen = true)}>
				<Code class="h-3.5 w-3.5 sm:mr-1.5 sm:h-4 sm:w-4" />
				<span class="hidden sm:inline">Export</span>
			</Button>

			<Button size="sm" color="primary" onclick={() => (isTestSendOpen = true)}>
				<Send class="h-3.5 w-3.5 sm:mr-1.5 sm:h-4 sm:w-4" />
				<span class="hidden sm:inline">Send Test</span>
			</Button>

			<div class="mx-0.5 hidden h-4 w-px bg-neutral-200 sm:block dark:bg-neutral-800"></div>

			<!-- UI Theme Toggle -->
			<div class="hidden sm:inline-flex">
				<Tooltip text="Toggle Interface Theme">
					<ThemeToggle />
				</Tooltip>
			</div>

			<!-- Account Trigger (hidden on mobile, available in more menu) -->
			<div class="hidden sm:inline-flex">
				<Tooltip text="Account Profile & Cloud Sync">
					<Button
						size="sm"
						color="neutral"
						variant="ghost"
						aria-label="Account Profile"
						onclick={() => (isAuthOpen = true)}
					>
						<User class="h-4 w-4" />
					</Button>
				</Tooltip>
			</div>

			<!-- More / Overflow Menu -->
			<DropdownMenu items={moreMenuItems}>
				{#snippet trigger()}
					<Button size="sm" color="neutral" variant="ghost" aria-label="More options">
						<MoreHorizontal class="h-4 w-4" />
					</Button>
				{/snippet}
			</DropdownMenu>
		</div>
	</header>

	<!-- 3-Pane Editor Layout with Responsive Mobile Panels -->
	<div class="relative flex flex-1 overflow-hidden">
		<!-- Left Sidebar: Palette / Layers / Variables -->
		<aside
			class="flex flex-col border-r border-neutral-200 bg-white transition-all dark:border-neutral-800 dark:bg-neutral-900 {mobilePane ===
			'palette'
				? 'absolute inset-0 z-20 flex w-full'
				: 'hidden lg:flex lg:w-80 lg:shrink-0'}"
		>
			<!-- Tab Bar Header -->
			<div
				class="flex shrink-0 items-center justify-between border-b border-neutral-200 bg-neutral-50/80 p-3 dark:border-neutral-800 dark:bg-neutral-900/80"
			>
				<Tabs items={sidebarTabs} bind:value={activeLeftTab} variant="segmented" class="flex-1" />
				<div class="ml-2 lg:hidden">
					<Button
						size="xs"
						color="primary"
						variant="subtle"
						onclick={() => (mobilePane = 'canvas')}
					>
						Done
					</Button>
				</div>
			</div>

			<!-- Dynamic Panel Content -->
			<div class="flex-1 overflow-y-auto p-4">
				{#if activeLeftTab === 'blocks'}
					<BlockPalette onBlockAdded={() => (mobilePane = 'canvas')} />
				{:else if activeLeftTab === 'layers'}
					<LayersTree />
				{:else if activeLeftTab === 'variables'}
					<VariableManager />
				{/if}
			</div>
		</aside>

		<!-- Center Preview Canvas -->
		<main
			class="flex flex-1 items-center justify-center overflow-auto bg-neutral-100 p-2 sm:p-6 dark:bg-neutral-950 {mobilePane ===
			'canvas'
				? 'flex'
				: 'hidden lg:flex'}"
		>
			<div
				class="h-full max-w-full overflow-hidden rounded-xl border border-neutral-300 shadow-2xl transition-all duration-300 sm:h-[90vh] dark:border-neutral-800 {studio.simulateDarkMode
					? 'bg-[#1a1a1a]'
					: 'bg-white'}"
				style:width={studio.previewMode === 'desktop' ? '640px' : '375px'}
				style:max-width="100%"
				style:filter={studio.simulateDarkMode ? 'invert(0.9) hue-rotate(180deg)' : 'none'}
			>
				<iframe srcdoc={studio.compiledHtml} class="h-full w-full border-0" title="Email Preview"
				></iframe>
			</div>
		</main>

		<!-- Right Sidebar: Inspector Panel -->
		<aside
			class="flex flex-col border-l border-neutral-200 bg-white transition-all dark:border-neutral-800 dark:bg-neutral-900 {mobilePane ===
			'inspector'
				? 'absolute inset-0 z-20 flex w-full'
				: 'hidden lg:flex lg:w-80 lg:shrink-0'}"
		>
			<div
				class="flex shrink-0 items-center justify-between border-b border-neutral-200 bg-neutral-50/80 px-4 py-3 lg:hidden dark:border-neutral-800 dark:bg-neutral-900/80"
			>
				<span class="text-sm font-bold text-neutral-900 dark:text-neutral-100">
					{studio.selectedBlockId ? 'Block Inspector' : 'Global Settings'}
				</span>
				<Button size="xs" color="primary" variant="subtle" onclick={() => (mobilePane = 'canvas')}>
					Done
				</Button>
			</div>
			<div class="flex-1 overflow-y-auto">
				<InspectorPanel />
			</div>
		</aside>
	</div>

	<!-- Mobile Bottom Navigation Bar (< lg screens) -->
	<nav
		class="flex h-14 shrink-0 border-t border-neutral-200 bg-white/95 px-2 backdrop-blur-md transition-colors lg:hidden dark:border-neutral-800 dark:bg-neutral-900/95"
	>
		<button
			type="button"
			class="flex flex-1 flex-col items-center justify-center gap-1 transition-colors {mobilePane ===
			'palette'
				? 'font-bold text-primary-600 dark:text-primary-400'
				: 'text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200'}"
			onclick={() => (mobilePane = 'palette')}
		>
			<LayoutGrid class="h-4.5 w-4.5" />
			<span class="text-[10px]">Add Blocks</span>
		</button>

		<button
			type="button"
			class="flex flex-1 flex-col items-center justify-center gap-1 transition-colors {mobilePane ===
			'canvas'
				? 'font-bold text-primary-600 dark:text-primary-400'
				: 'text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200'}"
			onclick={() => (mobilePane = 'canvas')}
		>
			<Eye class="h-4.5 w-4.5" />
			<span class="text-[10px]">Canvas</span>
		</button>

		<button
			type="button"
			class="flex flex-1 flex-col items-center justify-center gap-1 transition-colors {mobilePane ===
			'inspector'
				? 'font-bold text-primary-600 dark:text-primary-400'
				: 'text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200'}"
			onclick={() => (mobilePane = 'inspector')}
		>
			<Settings2 class="h-4.5 w-4.5" />
			<span class="text-[10px]">Settings</span>
		</button>
	</nav>

	<!-- Modals -->
	<SendTestModal bind:open={isTestSendOpen} />
	<ExportModal bind:open={isExportOpen} />
	<TemplateLibraryModal bind:open={isLibraryOpen} />
	<SponsorModal bind:open={isSponsorOpen} />
	<ThemeModal bind:open={isThemeOpen} />
	<AuthModal bind:open={isAuthOpen} />

	<!-- Floating Shortcut Hints Bar (Desktop only) -->
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
