<!-- src/routes/(legal)/privacy/+page.svelte -->
<script lang="ts">
	import { Seo, LegalDocument } from 'yaxa-svelte';
</script>

<Seo
	title="Privacy Policy"
	description="Privacy policy and data protection practices for FrostMail, covering ethical advertising, authentication, and local data storage."
/>

<LegalDocument
	type="privacy"
	customClauses={[
		{
			id: 'template-storage',
			title: '8. Email Template Data & Diagnostics',
			content:
				'Guest designs are stored solely in your local browser storage (`localStorage`). Cloud-saved templates are encrypted and stored in PostgreSQL under your authenticated account. Diagnostic DNS queries and spam score analyses are processed in-memory and never sold or shared.'
		}
	]}
/>
