<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import './layout.css';
	import { YaxaApp } from 'yaxa-svelte';
	import { siteConfig } from '$lib/config/site';

	let { children } = $props();
</script>

<YaxaApp config={siteConfig}>
	{#if children}
		{@render children()}
	{/if}
</YaxaApp>
