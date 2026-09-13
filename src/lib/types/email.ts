// src/lib/types/email.ts

export type BlockType = 'section' | 'column' | 'text' | 'button' | 'image' | 'divider' | 'spacer';

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

export type ContentBlock = TextBlock | ButtonBlock | ImageBlock | DividerBlock | SpacerBlock;

export interface ColumnBlock extends BaseBlock {
	type: 'column';
	width?: string;
	children: ContentBlock[];
}

export interface SectionBlock extends BaseBlock {
	type: 'section';
	backgroundColor?: string;
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
