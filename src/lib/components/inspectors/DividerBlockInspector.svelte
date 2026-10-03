<!-- src/lib/components/inspectors/DividerBlockInspector.svelte -->
<script lang="ts">
	import type { DividerBlock } from '#lib/types/email.js';

	let { block = $bindable() }: { block?: DividerBlock } = $props();
	void block;
</script>

<div class="p-6 text-center text-sm text-neutral-400 italic">
	Divider renders a standard email horizontal divider line.
</div>
