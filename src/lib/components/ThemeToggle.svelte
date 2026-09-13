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
		<Moon class="h-4 w-4 text-neutral-300" />
	{:else}
		<Sun class="h-4 w-4 text-neutral-600" />
	{/if}
</Button>
