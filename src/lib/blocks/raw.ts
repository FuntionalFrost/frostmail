// src/lib/blocks/raw.ts
import type { RawBlock } from '$lib/types/email';
import type { BlockPlugin } from './types';
import { Code } from '@lucide/svelte';
import RawBlockInspector from '$lib/components/inspectors/RawBlockInspector.svelte';

export const rawBlockPlugin: BlockPlugin<RawBlock> = {
	type: 'raw',
	label: 'Raw HTML / Snippet',
	category: 'content',
	icon: Code,
	factory: () => ({
		id: `raw_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
		type: 'raw',
		content:
			'<div style="padding: 12px; background: #f1f5f9; border-radius: 6px; font-size: 13px; color: #334155; text-align: center;">\n  Custom raw HTML snippet\n</div>'
	}),
	toMjml: (block, context) => {
		const blockClass = context?.forCanvas ? `css-class="mf-selectable mf-id-${block.id}"` : '';
		return `<mj-raw ${blockClass}>${block.content || ''}</mj-raw>`;
	},
	toReactEmail: (block) => {
		return `            <div dangerouslySetInnerHTML={{ __html: \`${(block.content || '').replace(/`/g, '\\`')}\` }} />`;
	},
	inspector: RawBlockInspector
};
