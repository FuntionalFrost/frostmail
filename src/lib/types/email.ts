// src/lib/types/email.ts

export type BlockType =
	| 'section'
	| 'column'
	| 'text'
	| 'button'
	| 'image'
	| 'divider'
	| 'spacer'
	| 'badge'
	| 'social'
	| 'raw';

export interface BaseBlock {
	id: string;
	type: BlockType;
	styles?: Record<string, string | number>;
}

export interface TextBlock extends BaseBlock {
	type: 'text';
	content: string;
	align?: 'left' | 'center' | 'right';
}

export interface ButtonBlock extends BaseBlock {
	type: 'button';
	label: string;
	url: string;
	backgroundColor?: string;
	color?: string;
	borderRadius?: string;
	align?: 'left' | 'center' | 'right';
}

export interface ImageBlock extends BaseBlock {
	type: 'image';
	src: string;
	alt: string;
	width?: string;
	href?: string;
	align?: 'left' | 'center' | 'right';
}

export interface DividerBlock extends BaseBlock {
	type: 'divider';
}

export interface SpacerBlock extends BaseBlock {
	type: 'spacer';
	height?: string;
}

export interface BadgeBlock extends BaseBlock {
	type: 'badge';
	text: string;
	backgroundColor?: string;
	color?: string;
	borderRadius?: string;
	fontSize?: string;
	align?: 'left' | 'center' | 'right';
}

export interface SocialNetworkItem {
	id: string;
	network: 'x' | 'github' | 'linkedin' | 'facebook' | 'instagram' | 'youtube' | 'web';
	url: string;
	label?: string;
}

export interface SocialBlock extends BaseBlock {
	type: 'social';
	align?: 'left' | 'center' | 'right';
	iconSize?: string;
	innerPadding?: string;
	networks: SocialNetworkItem[];
}

export interface RawBlock extends BaseBlock {
	type: 'raw';
	content: string;
}

export type ContentBlock =
	| TextBlock
	| ButtonBlock
	| ImageBlock
	| DividerBlock
	| SpacerBlock
	| BadgeBlock
	| SocialBlock
	| RawBlock;

export interface ColumnBlock extends BaseBlock {
	type: 'column';
	width?: string;
	backgroundColor?: string;
	padding?: string;
	children: ContentBlock[];
}

export interface SectionBlock extends BaseBlock {
	type: 'section';
	backgroundColor?: string;
	padding?: string;
	children: ColumnBlock[];
}

export type AnyBlock = SectionBlock | ColumnBlock | ContentBlock;

export interface EmailTemplate {
	id: string;
	name: string;
	subject: string;
	preheader: string;
	globalStyles: {
		fontFamily: string;
		backgroundColor: string;
		contentWidth: string;
	};
	body: SectionBlock[];
}

export interface CompilerResult {
	html: string;
	errors: Array<{ line: number; message: string; tagName: string }>;
	sizeKb: number;
	isClippedInGmail: boolean;
}

export interface SavedProject {
	id: string;
	name: string;
	updatedAt: string;
	template: EmailTemplate;
}
