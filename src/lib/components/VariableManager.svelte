<!-- src/lib/components/VariableManager.svelte -->
<script lang="ts">
	import { studio } from '$lib/stores/studio.svelte';
	import { Textarea } from 'yaxa-svelte';
	import { Check, Copy } from '@lucide/svelte';

	let copiedTag = $state<string | null>(null);

	function extractKeys(obj: unknown, prefix = ''): string[] {
		let keys: string[] = [];
		if (typeof obj === 'object' && obj !== null && !Array.isArray(obj)) {
			for (const [k, v] of Object.entries(obj)) {
				const fullKey = prefix ? `${prefix}.${k}` : k;
				if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
					keys = keys.concat(extractKeys(v, fullKey));
				} else {
					keys.push(fullKey);
				}
			}
		}
		return keys;
	}

	let parsedState = $derived.by<{ keys: string[]; error: string | null }>(() => {
		try {
			const raw = studio.mockDataJson || '{}';
			const parsed = JSON.parse(raw) as unknown;
			return {
				keys: extractKeys(parsed),
				error: null
			};
		} catch {
			return {
				keys: [],
				error: 'Invalid JSON syntax'
			};
		}
	});

	let availableKeys = $derived(parsedState.keys);
	let jsonError = $derived(parsedState.error);

	async function copyTag(key: string) {
		const tag = `{{ ${key} }}`;
		await navigator.clipboard.writeText(tag);
		copiedTag = key;
		setTimeout(() => {
			copiedTag = null;
		}, 1500);
	}
</script>

<div class="space-y-4 text-sm">
	<div>
		<div class="mb-1.5 text-xs font-semibold tracking-wider text-neutral-500 uppercase">
			Available Merge Tags
		</div>
		<p class="mb-2.5 text-xs text-neutral-400">Click any tag to copy its interpolation syntax.</p>

		{#if availableKeys.length === 0}
			<div class="text-sm text-neutral-400 italic">No variables found in JSON.</div>
		{/if}

		<div class="flex flex-wrap gap-2 pt-1">
			{#each availableKeys as key (key)}
				<button
					type="button"
					class="border-primary-200 bg-primary-50 text-primary-600 hover:bg-primary-100 dark:border-primary-900 dark:bg-primary-950/60 dark:text-primary-400 dark:hover:bg-primary-900 flex cursor-pointer items-center gap-1.5 rounded-md border px-2.5 py-1.5 font-mono text-sm transition"
					onclick={() => copyTag(key)}
				>
					<span>&#123;&#123; {key} &#125;&#125;</span>
					{#if copiedTag === key}
						<Check class="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
					{:else}
						<Copy class="h-3.5 w-3.5 opacity-70" />
					{/if}
				</button>
			{/each}
		</div>
	</div>

	<div class="space-y-2">
		<div class="flex items-center justify-between">
			<label
				for="mock-vars-textarea"
				class="text-xs font-semibold tracking-wider text-neutral-500 uppercase"
			>
				Mock Variables (JSON)
			</label>
			{#if jsonError}
				<span class="text-xs font-medium text-rose-500">{jsonError}</span>
			{/if}
		</div>
		<Textarea
			id="mock-vars-textarea"
			bind:value={studio.mockDataJson}
			oninput={studio.onTemplateChanged}
			rows={12}
			class="font-mono text-sm"
			placeholder={`{\n  "user": { "name": "Alex" }\n}`}
		/>
	</div>
</div>
