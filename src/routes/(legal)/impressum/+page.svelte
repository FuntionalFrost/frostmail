<!-- src/routes/(legal)/impressum/+page.svelte -->
<script lang="ts">
	import { Seo, LegalDocument } from 'yaxa-svelte';
</script>

<Seo
	title="Legal Notice (Impressum)"
	description="Provider identification and mandatory legal disclosure pursuant to EU regulations (§ 5 TMG / DDG)."
/>

<LegalDocument type="impressum" />
