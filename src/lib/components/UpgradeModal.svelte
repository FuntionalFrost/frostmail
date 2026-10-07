<!-- src/lib/components/UpgradeModal.svelte -->
<script lang="ts">
	import SponsorModal from './SponsorModal.svelte';

	interface Props {
		open?: boolean;
		userEmail?: string;
	}

	let { open = $bindable(false) }: Props = $props();
</script>

<SponsorModal bind:open />
