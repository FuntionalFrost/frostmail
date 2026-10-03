// src/lib/blocks/registry.ts
import type { ContentBlock } from '#lib/types/email.js';
import type { BlockPlugin, LayoutPreset } from './types';
import { textBlockPlugin } from './text';
import { buttonBlockPlugin } from './button';
import { imageBlockPlugin } from './image';
import { badgeBlockPlugin } from './badge';
import { socialBlockPlugin } from './social';
import { rawBlockPlugin } from './raw';
import { dividerBlockPlugin } from './divider';
import { spacerBlockPlugin } from './spacer';
import { Square, Columns2, Columns3, PanelLeft, PanelRight } from '@lucide/svelte';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const BLOCK_REGISTRY: Record<ContentBlock['type'], BlockPlugin<any>> = {
	text: textBlockPlugin,
	button: buttonBlockPlugin,
	image: imageBlockPlugin,
	badge: badgeBlockPlugin,
	social: socialBlockPlugin,
	raw: rawBlockPlugin,
	divider: dividerBlockPlugin,
	spacer: spacerBlockPlugin
};

export const LAYOUT_PRESETS: LayoutPreset[] = [
	{
		id: 'col_1',
		label: '1 Column',
		description: 'Full width single column',
		icon: Square,
		columns: ['100%']
	},
	{
		id: 'col_2_equal',
		label: '2 Columns (50 / 50)',
		description: 'Two equal columns side-by-side',
		icon: Columns2,
		columns: ['50%', '50%']
	},
	{
		id: 'col_2_split_left',
		label: '2 Columns (33 / 67)',
		description: 'Narrow left sidebar, wide right content',
		icon: PanelLeft,
		columns: ['33.33%', '66.67%']
	},
	{
		id: 'col_2_split_right',
		label: '2 Columns (67 / 33)',
		description: 'Wide left content, narrow right sidebar',
		icon: PanelRight,
		columns: ['66.67%', '33.33%']
	},
	{
		id: 'col_3_equal',
		label: '3 Columns (33 / 33 / 33)',
		description: 'Three equal columns side-by-side',
		icon: Columns3,
		columns: ['33.33%', '33.33%', '33.33%']
	}
];
