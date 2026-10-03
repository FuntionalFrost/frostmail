<!-- src/lib/components/inspectors/GlobalSettingsInspector.svelte -->
<script lang="ts">
	import { studio } from '$lib/stores/studio.svelte';
	import { FormField, Input, Select, ColorPicker } from 'yaxa-svelte';
	import { EMAIL_SAFE_FONTS } from '$lib/constants/blocks';

	const fontOptions = EMAIL_SAFE_FONTS.map((f) => ({ value: f.value, label: f.label }));
</script>

<div class="space-y-4 p-4">
	<FormField label="Subject Line">
		<Input bind:value={studio.template.subject} oninput={studio.onTemplateChanged} size="sm" />
	</FormField>

	<FormField label="Preheader Preview">
		<Input bind:value={studio.template.preheader} oninput={studio.onTemplateChanged} size="sm" />
	</FormField>

	<FormField label="Font Family">
		<Select
			bind:value={studio.template.globalStyles.fontFamily}
			onchange={studio.onTemplateChanged}
			options={fontOptions}
			size="sm"
		/>
	</FormField>

	<div class="grid grid-cols-2 gap-2.5">
		<FormField label="Canvas Background">
			<ColorPicker bind:value={studio.template.globalStyles.backgroundColor} class="w-full" />
		</FormField>
		<FormField label="Max Width">
			<Input
				bind:value={studio.template.globalStyles.contentWidth}
				oninput={studio.onTemplateChanged}
				placeholder="600px"
				size="sm"
			/>
		</FormField>
	</div>
</div>
