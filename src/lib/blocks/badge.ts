// src/lib/blocks/badge.ts
import type { BadgeBlock } from '$lib/types/email';
import type { BlockPlugin } from './types';
import { Tag } from '@lucide/svelte';
import BadgeBlockInspector from '$lib/components/inspectors/BadgeBlockInspector.svelte';

export const badgeBlockPlugin: BlockPlugin<BadgeBlock> = {
	type: 'badge',
	label: 'Badge / Tag',
	category: 'content',
	icon: Tag,
	factory: () => ({
		id: `bdg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
		type: 'badge',
		text: 'FEATURED',
		backgroundColor: '#e0f2fe',
		color: '#0284c7',
		borderRadius: '9999px',
		fontSize: '11px',
		align: 'left'
	}),
	toMjml: (block, context) => {
		const blockClass = context?.forCanvas ? `css-class="mf-selectable mf-id-${block.id}"` : '';
		const alignAttr = block.align ? `align="${block.align}"` : '';
		const spanStyle = `display:inline-block;padding:4px 10px;border-radius:${block.borderRadius || '9999px'};background-color:${block.backgroundColor || '#e0f2fe'};color:${block.color || '#0284c7'};font-size:${block.fontSize || '11px'};font-weight:700;letter-spacing:0.5px;text-transform:uppercase;`;
		return `<mj-text ${blockClass} ${alignAttr} padding="4px 0px"><span style="${spanStyle}">${block.text || 'BADGE'}</span></mj-text>`;
	},
	toReactEmail: (block) => {
		const alignClass =
			block.align === 'center'
				? 'text-center'
				: block.align === 'right'
					? 'text-right'
					: 'text-left';
		return `            <Section className="${alignClass} my-1">
              <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: '${block.borderRadius || '9999px'}', backgroundColor: '${block.backgroundColor || '#e0f2fe'}', color: '${block.color || '#0284c7'}', fontSize: '${block.fontSize || '11px'}', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                ${block.text || 'BADGE'}
              </span>
            </Section>`;
	},
	inspector: BadgeBlockInspector
};
