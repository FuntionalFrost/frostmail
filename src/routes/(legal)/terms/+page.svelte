<!-- src/routes/(legal)/terms/+page.svelte -->
<script lang="ts">
	import { Seo, LegalDocument } from 'yaxa-svelte';
</script>

<Seo
	title="Terms of Service"
	description="The terms and conditions governing your access to and use of FrostMail."
/>

<LegalDocument
	type="terms"
	customClauses={[
		{
			id: 'anti-spam',
			title: '7. Anti-Spam & Deliverability Policy',
			content:
				'You agree not to use FrostMail for generating phishing lures, malware vectors, or unsolicited commercial email in violation of CAN-SPAM or GDPR. FrostMail is provided free of charge under the MIT License, and deliverability diagnostics and scoring are provided as analytical guidelines without guarantee of third-party mailbox placement.'
		}
	]}
/>
