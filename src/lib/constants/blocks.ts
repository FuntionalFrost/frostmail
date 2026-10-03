// src/lib/constants/blocks.ts
import type { ContentBlock } from '#lib/types/email.js';

export interface BlockDefinition {
	type: ContentBlock['type'];
	label: string;
	icon: string;
	factory: () => ContentBlock;
}

import { BLOCK_REGISTRY } from '#lib/blocks/index.js';

export const BLOCK_DEFINITIONS = BLOCK_REGISTRY;

export const EMAIL_SAFE_FONTS = [
	{ label: 'Inter (Modern Sans)', value: 'Inter, Helvetica, Arial, sans-serif' },
	{ label: 'Helvetica / Arial (Clean Sans)', value: 'Helvetica, Arial, sans-serif' },
	{ label: 'Georgia (Classic Serif)', value: 'Georgia, serif' },
	{ label: 'Times New Roman (Traditional)', value: '"Times New Roman", Times, serif' },
	{ label: 'Trebuchet MS (Geometric)', value: '"Trebuchet MS", sans-serif' },
	{ label: 'Verdana (Legible Sans)', value: 'Verdana, Geneva, sans-serif' },
	{ label: 'Courier New (Monospace)', value: '"Courier New", Courier, monospace' }
];
