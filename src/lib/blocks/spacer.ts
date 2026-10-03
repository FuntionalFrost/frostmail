// src/lib/blocks/spacer.ts
import type { SpacerBlock } from '$lib/types/email';
import type { BlockPlugin } from './types';
import { MoveVertical } from '@lucide/svelte';
import SpacerBlockInspector from '$lib/components/inspectors/SpacerBlockInspector.svelte';

export const spacerBlockPlugin: BlockPlugin<SpacerBlock> = {
	type: 'spacer',
	label: 'Vertical Spacer',
	category: 'content',
	icon: MoveVertical,
	factory: () => ({
		id: `spc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
		type: 'spacer',
		height: '24px'
	}),
	toMjml: (block, context) => {
		const blockClass = context?.forCanvas ? `css-class="mf-selectable mf-id-${block.id}"` : '';
		return `<mj-spacer ${blockClass} height="${block.height || '24px'}" />`;
	},
	toReactEmail: (block) => {
		return `            <Section style={{ height: '${block.height || '24px'}' }} />`;
	},
	inspector: SpacerBlockInspector
};
