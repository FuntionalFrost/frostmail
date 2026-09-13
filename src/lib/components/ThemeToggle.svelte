<!-- src/lib/components/ThemeToggle.svelte -->
<script lang="ts">
	import { useColorMode, Button } from 'yaxa-svelte';
	import { Moon, Sun } from '@lucide/svelte';

	const colorMode = useColorMode();
</script>

<Button
	variant="ghost"
	color="neutral"
	size="sm"
	aria-label="Toggle Color Theme"
	onclick={() => colorMode.toggle()}
>
	{#if colorMode.isDark}
		<Moon class="h-4.5 w-4.5 text-amber-400" />
	{:else}
		<Sun class="h-4.5 w-4.5 text-neutral-800 hover:text-neutral-950" />
	{/if}
</Button>
