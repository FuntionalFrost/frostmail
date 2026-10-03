// src/lib/blocks/divider.ts
import type { DividerBlock } from '#lib/types/email.js';
import type { BlockPlugin } from './types';
import { Minus } from '@lucide/svelte';
import DividerBlockInspector from '#lib/components/inspectors/DividerBlockInspector.svelte';

export const dividerBlockPlugin: BlockPlugin<DividerBlock> = {
	type: 'divider',
	label: 'Divider Line',
	category: 'content',
	icon: Minus,
	factory: () => ({
		id: `div_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
		type: 'divider'
	}),
	toMjml: (block, context) => {
		const blockClass = context?.forCanvas ? `css-class="mf-selectable mf-id-${block.id}"` : '';
		return `<mj-divider ${blockClass} border-width="1px" border-color="#e2e8f0" padding="16px 0px" />`;
	},
	toReactEmail: () => {
		return `            <Hr className="border-gray-200 my-4" />`;
	},
	inspector: DividerBlockInspector
};
