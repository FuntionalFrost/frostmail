<!-- src/lib/components/TemplateLibraryModal.svelte -->
<script lang="ts">
	import { studio } from '$lib/stores/studio.svelte';
	import type { SavedProject } from '$lib/types/email';
	import { Modal, Button, Badge, Input } from 'yaxa-svelte';
	import { Cloud, Smartphone, Bookmark, Plus, Trash2 } from '@lucide/svelte';

	interface Props {
		open?: boolean;
		isLoggedIn?: boolean;
	}

	let { open = $bindable(false), isLoggedIn = false }: Props = $props();

	let saveNameInput = $state('');
	let showSaveInput = $state(false);

	$effect(() => {
		if (open && isLoggedIn) {
			studio.syncCloudTemplates();
		}
	});

	function handleSelect(project: SavedProject) {
		studio.loadProject(project);
		open = false;
	}

	function handleCreateNew() {
		studio.createNewBlankProject();
		open = false;
	}

	function handleSaveAs() {
		if (!saveNameInput.trim()) return;
		studio.saveCurrentProject(saveNameInput.trim());
		saveNameInput = '';
		showSaveInput = false;
	}
</script>

<Modal
	bind:open
	title="Template Library"
	description="Manage, load, and organize your saved email designs."
	size="lg"
>
	<div class="space-y-4 text-sm">
		<div class="flex items-center justify-between">
			<div>
				<Badge color={isLoggedIn ? 'success' : 'neutral'} variant="subtle" size="sm">
					{#if isLoggedIn}
						<Cloud class="mr-1 h-3.5 w-3.5" />
						Cloud Synced
					{:else}
						<Smartphone class="mr-1 h-3.5 w-3.5" />
						Local Storage
					{/if}
				</Badge>
			</div>
			<div class="flex gap-2">
				<Button
					color="neutral"
					variant="outline"
					size="sm"
					onclick={() => (showSaveInput = !showSaveInput)}
				>
					<Bookmark class="mr-1.5 h-3.5 w-3.5" />
					Save As Copy
				</Button>
				<Button color="primary" size="sm" onclick={handleCreateNew}>
					<Plus class="mr-1.5 h-3.5 w-3.5" />
					New Blank
				</Button>
			</div>
		</div>

		<!-- Inline Save-As Form -->
		{#if showSaveInput}
			<div class="flex items-center gap-2 rounded-lg bg-neutral-100 p-3 dark:bg-neutral-800">
				<Input
					bind:value={saveNameInput}
					placeholder="Template name (e.g. Black Friday Promo)"
					size="sm"
					class="flex-1"
				/>
				<Button size="sm" color="primary" onclick={handleSaveAs}>Save</Button>
			</div>
		{/if}

		<!-- Projects Grid -->
		<div class="grid max-h-96 grid-cols-1 gap-3 overflow-y-auto pt-1 sm:grid-cols-2">
			{#each studio.savedProjects as project (project.id)}
				{@const isActive = studio.currentProjectId === project.id}
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div
					class="flex cursor-pointer flex-col justify-between rounded-xl border p-4 transition {isActive
						? 'border-primary-500 bg-primary-50/30 dark:bg-primary-950/20'
						: 'border-neutral-200 bg-white hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700'}"
					onclick={() => handleSelect(project)}
				>
					<div class="space-y-1.5">
						<div class="flex items-start justify-between gap-2">
							<span class="truncate text-base font-bold text-neutral-900 dark:text-neutral-100"
								>{project.name}</span
							>
							{#if isActive}
								<Badge size="sm" color="primary" variant="subtle">Active</Badge>
							{/if}
						</div>
						<p class="truncate text-sm text-neutral-500">
							{project.template.subject || 'No subject line'}
						</p>
					</div>

					<div
						class="mt-3 flex items-center justify-between border-t border-neutral-200 pt-3 text-sm text-neutral-600 dark:border-neutral-800 dark:text-neutral-400"
					>
						<span>{new Date(project.updatedAt).toLocaleDateString()}</span>
						{#if studio.savedProjects.length > 1}
							<Button
								color="error"
								variant="ghost"
								size="sm"
								aria-label="Delete Template"
								onclick={(e) => {
									e.stopPropagation();
									studio.deleteProject(project.id);
								}}
							>
								<Trash2 class="h-4 w-4" />
							</Button>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</div>
</Modal>
