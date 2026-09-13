<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import './layout.css';
	import { YaxaApp, Favicons } from 'yaxa-svelte';
	import { siteConfig } from '$lib/config/site';

	let { children } = $props();
</script>

<YaxaApp config={siteConfig}>
	<Favicons />
	{#if children}
		{@render children()}
	{/if}
</YaxaApp>
