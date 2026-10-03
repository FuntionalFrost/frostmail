// src/lib/blocks/text.ts
import type { TextBlock } from '#lib/types/email.js';
import type { BlockPlugin } from './types';
import { FileText } from '@lucide/svelte';
import TextBlockInspector from '#lib/components/inspectors/TextBlockInspector.svelte';

export const textBlockPlugin: BlockPlugin<TextBlock> = {
	type: 'text',
	label: 'Text Paragraph',
	category: 'content',
	icon: FileText,
	factory: () => ({
		id: `txt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
		type: 'text',
		content: '<p>New paragraph of text. Click to edit.</p>',
		align: 'left'
	}),
	toMjml: (block, context) => {
		const blockClass = context?.forCanvas ? `css-class="mf-selectable mf-id-${block.id}"` : '';
		const alignAttr = block.align ? `align="${block.align}"` : '';
		return `<mj-text ${blockClass} ${alignAttr}>${block.content || ''}</mj-text>`;
	},
	toReactEmail: (block) => {
		const alignClass =
			block.align === 'center'
				? 'text-center'
				: block.align === 'right'
					? 'text-right'
					: 'text-left';
		return `            <Text className="text-gray-800 m-0 ${alignClass}">\n              ${(block.content || '').replace(/<[^>]*>/g, '')}\n            </Text>`;
	},
	inspector: TextBlockInspector
};
