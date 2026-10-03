// src/lib/blocks/image.ts
import type { ImageBlock } from '#lib/types/email.js';
import type { BlockPlugin } from './types';
import { Image as ImageIcon } from '@lucide/svelte';
import ImageBlockInspector from '#lib/components/inspectors/ImageBlockInspector.svelte';

export const imageBlockPlugin: BlockPlugin<ImageBlock> = {
	type: 'image',
	label: 'Image',
	category: 'content',
	icon: ImageIcon,
	factory: () => ({
		id: `img_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
		type: 'image',
		src: 'https://placehold.co/600x200/e2e8f0/475569?text=Image+Banner',
		alt: 'Banner placeholder',
		width: '100%',
		align: 'center'
	}),
	toMjml: (block, context) => {
		const blockClass = context?.forCanvas ? `css-class="mf-selectable mf-id-${block.id}"` : '';
		const hrefAttr = block.href ? `href="${block.href}"` : '';
		return `<mj-image ${blockClass} align="${block.align || 'center'}" src="${block.src || ''}" alt="${block.alt || ''}" width="${block.width || 'auto'}" ${hrefAttr} />`;
	},
	toReactEmail: (block) => {
		const imgTag = `<Img src="${block.src || ''}" alt="${block.alt || ''}" width="${block.width || '100%'}" className="rounded-md" />`;
		if (block.href) {
			return `            <Link href="${block.href}">\n              ${imgTag}\n            </Link>`;
		}
		return `            ${imgTag}`;
	},
	inspector: ImageBlockInspector
};
