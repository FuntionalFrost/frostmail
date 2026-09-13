// src/lib/constants/blocks.ts
import type { ContentBlock } from '$lib/types/email';

export interface BlockDefinition {
	type: ContentBlock['type'];
	label: string;
	icon: string;
	factory: () => ContentBlock;
}

export const BLOCK_DEFINITIONS: Record<ContentBlock['type'], BlockDefinition> = {
	text: {
		type: 'text',
		label: 'Text Paragraph',
		icon: 'text',
		factory: () => ({
			id: `txt_${Date.now()}`,
			type: 'text',
			content: '<p>New paragraph of text. Click to edit.</p>'
		})
	},
	button: {
		type: 'button',
		label: 'Action Button',
		icon: 'cursor',
		factory: () => ({
			id: `btn_${Date.now()}`,
			type: 'button',
			label: 'Click Here',
			url: 'https://example.com',
			backgroundColor: '#0284c7',
			color: '#ffffff',
			borderRadius: '4px'
		})
	},
	image: {
		type: 'image',
		label: 'Image',
		icon: 'image',
		factory: () => ({
			id: `img_${Date.now()}`,
			type: 'image',
			src: 'https://placehold.co/600x200',
			alt: 'Banner placeholder',
			width: '100%'
		})
	},
	divider: {
		type: 'divider',
		label: 'Divider Line',
		icon: 'minus',
		factory: () => ({
			id: `div_${Date.now()}`,
			type: 'divider'
		})
	},
	spacer: {
		type: 'spacer',
		label: 'Vertical Spacer',
		icon: 'move-vertical',
		factory: () => ({
			id: `spc_${Date.now()}`,
			type: 'spacer',
			height: '24px'
		})
	}
};

export const EMAIL_SAFE_FONTS = [
	{ label: 'Inter (Modern Sans)', value: 'Inter, Helvetica, Arial, sans-serif' },
	{ label: 'Helvetica / Arial (Clean Sans)', value: 'Helvetica, Arial, sans-serif' },
	{ label: 'Georgia (Classic Serif)', value: 'Georgia, serif' },
	{ label: 'Times New Roman (Traditional)', value: '"Times New Roman", Times, serif' },
	{ label: 'Trebuchet MS (Geometric)', value: '"Trebuchet MS", sans-serif' },
	{ label: 'Verdana (Legible Sans)', value: 'Verdana, Geneva, sans-serif' },
	{ label: 'Courier New (Monospace)', value: '"Courier New", Courier, monospace' }
];
