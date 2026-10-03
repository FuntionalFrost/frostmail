// src/lib/blocks/button.ts
import type { ButtonBlock } from '$lib/types/email';
import type { BlockPlugin } from './types';
import { MousePointerClick } from '@lucide/svelte';
import ButtonBlockInspector from '$lib/components/inspectors/ButtonBlockInspector.svelte';

export const buttonBlockPlugin: BlockPlugin<ButtonBlock> = {
	type: 'button',
	label: 'Action Button',
	category: 'content',
	icon: MousePointerClick,
	factory: () => ({
		id: `btn_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
		type: 'button',
		label: 'Click Here',
		url: 'https://example.com',
		backgroundColor: '#0284c7',
		color: '#ffffff',
		borderRadius: '6px',
		align: 'center'
	}),
	toMjml: (block, context) => {
		const blockClass = context?.forCanvas ? `css-class="mf-selectable mf-id-${block.id}"` : '';
		return `<mj-button ${blockClass} align="${block.align || 'center'}" href="${block.url || '#'}" background-color="${block.backgroundColor || '#0284c7'}" color="${block.color || '#ffffff'}" border-radius="${block.borderRadius || '6px'}">${block.label || 'Button'}</mj-button>`;
	},
	toReactEmail: (block) => {
		return `            <Button\n              href="${block.url || '#'}"\n              style={{\n                backgroundColor: '${block.backgroundColor || '#0284c7'}',\n                color: '${block.color || '#ffffff'}',\n                borderRadius: '${block.borderRadius || '6px'}',\n                padding: '12px 20px',\n              }}\n            >\n              ${block.label || 'Button'}\n            </Button>`;
	},
	inspector: ButtonBlockInspector
};
