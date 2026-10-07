<!-- src/lib/components/ThemeModal.svelte -->
<script lang="ts">
	import { Modal, ThemeStudio } from 'yaxa-svelte';

	interface Props {
		open?: boolean;
	}

	let { open = $bindable(false) }: Props = $props();
</script>

<Modal
	bind:open
	title="Theme & Style Customizer"
	description="Customize accent colors, neutral scales, harmonic radii, and typography in real time."
	size="xl"
>
	<div class="max-h-[75vh] overflow-y-auto p-1">
		<ThemeStudio showHeader={false} />
	</div>
</Modal>
