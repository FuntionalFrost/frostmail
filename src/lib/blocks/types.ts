// src/lib/blocks/types.ts
import type { Component } from 'svelte';
import type { BaseBlock, ContentBlock } from '#lib/types/email.js';

export interface BlockRenderContext {
	forCanvas?: boolean;
}

export interface BlockPlugin<T extends BaseBlock = ContentBlock> {
	type: T['type'];
	label: string;
	category: 'content' | 'layout';
	icon: Component<{ class?: string }>;
	factory: () => T;
	toMjml: (block: T, context?: BlockRenderContext) => string;
	toReactEmail: (block: T) => string;
	inspector: Component<{ block: T }>;
}

export interface LayoutPreset {
	id: string;
	label: string;
	description: string;
	icon: Component<{ class?: string }>;
	columns: string[]; // e.g. ['100%'] or ['50%', '50%'] or ['33.33%', '66.67%']
}
