// src/lib/blocks/serializers.ts
import type {
	ContentBlock,
	TextBlock,
	ButtonBlock,
	ImageBlock,
	BadgeBlock,
	SocialBlock,
	RawBlock,
	DividerBlock,
	SpacerBlock
} from '#lib/types/email.js';
import type { BlockRenderContext } from './types';

function mapNetworkToMjmlName(network: string): string {
	switch (network) {
		case 'x':
			return 'twitter-noshare';
		case 'github':
			return 'github-noshare';
		case 'linkedin':
			return 'linkedin-noshare';
		case 'facebook':
			return 'facebook-noshare';
		case 'instagram':
			return 'instagram-noshare';
		case 'youtube':
			return 'youtube-noshare';
		case 'web':
			return 'web-noshare';
		default:
			return 'web-noshare';
	}
}

export interface BlockSerializer<T extends ContentBlock = ContentBlock> {
	toMjml: (block: T, context?: BlockRenderContext) => string;
	toReactEmail: (block: T) => string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const BLOCK_SERIALIZERS: Record<ContentBlock['type'], BlockSerializer<any>> = {
	text: {
		toMjml: (block: TextBlock, context?: BlockRenderContext) => {
			const blockClass = context?.forCanvas ? `css-class="mf-selectable mf-id-${block.id}"` : '';
			const alignAttr = block.align ? `align="${block.align}"` : '';
			return `<mj-text ${blockClass} ${alignAttr}>${block.content || ''}</mj-text>`;
		},
		toReactEmail: (block: TextBlock) => {
			const alignClass =
				block.align === 'center'
					? 'text-center'
					: block.align === 'right'
						? 'text-right'
						: 'text-left';
			return `            <Text className="text-gray-800 m-0 ${alignClass}">\n              ${(block.content || '').replace(/<[^>]*>/g, '')}\n            </Text>`;
		}
	},
	button: {
		toMjml: (block: ButtonBlock, context?: BlockRenderContext) => {
			const blockClass = context?.forCanvas ? `css-class="mf-selectable mf-id-${block.id}"` : '';
			return `<mj-button ${blockClass} align="${block.align || 'center'}" href="${block.url || '#'}" background-color="${block.backgroundColor || '#0284c7'}" color="${block.color || '#ffffff'}" border-radius="${block.borderRadius || '6px'}">${block.label || 'Button'}</mj-button>`;
		},
		toReactEmail: (block: ButtonBlock) => {
			return `            <Button\n              href="${block.url || '#'}"\n              style={{\n                backgroundColor: '${block.backgroundColor || '#0284c7'}',\n                color: '${block.color || '#ffffff'}',\n                borderRadius: '${block.borderRadius || '6px'}',\n                padding: '12px 20px',\n              }}\n            >\n              ${block.label || 'Button'}\n            </Button>`;
		}
	},
	image: {
		toMjml: (block: ImageBlock, context?: BlockRenderContext) => {
			const blockClass = context?.forCanvas ? `css-class="mf-selectable mf-id-${block.id}"` : '';
			const hrefAttr = block.href ? `href="${block.href}"` : '';
			return `<mj-image ${blockClass} align="${block.align || 'center'}" src="${block.src || ''}" alt="${block.alt || ''}" width="${block.width || 'auto'}" ${hrefAttr} />`;
		},
		toReactEmail: (block: ImageBlock) => {
			const imgTag = `<Img src="${block.src || ''}" alt="${block.alt || ''}" width="${block.width || '100%'}" className="rounded-md" />`;
			if (block.href) {
				return `            <Link href="${block.href}">\n              ${imgTag}\n            </Link>`;
			}
			return `            ${imgTag}`;
		}
	},
	badge: {
		toMjml: (block: BadgeBlock, context?: BlockRenderContext) => {
			const blockClass = context?.forCanvas ? `css-class="mf-selectable mf-id-${block.id}"` : '';
			const alignAttr = block.align ? `align="${block.align}"` : '';
			const spanStyle = `display:inline-block;padding:4px 10px;border-radius:${block.borderRadius || '9999px'};background-color:${block.backgroundColor || '#e0f2fe'};color:${block.color || '#0284c7'};font-size:${block.fontSize || '11px'};font-weight:700;letter-spacing:0.5px;text-transform:uppercase;`;
			return `<mj-text ${blockClass} ${alignAttr} padding="4px 0px"><span style="${spanStyle}">${block.text || 'BADGE'}</span></mj-text>`;
		},
		toReactEmail: (block: BadgeBlock) => {
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
		}
	},
	social: {
		toMjml: (block: SocialBlock, context?: BlockRenderContext) => {
			const blockClass = context?.forCanvas ? `css-class="mf-selectable mf-id-${block.id}"` : '';
			const elementsHtml = (block.networks || [])
				.map((item) => {
					const mjmlName = mapNetworkToMjmlName(item.network);
					return `    <mj-social-element name="${mjmlName}" href="${item.url || '#'}" />`;
				})
				.join('\n');

			return `<mj-social ${blockClass} align="${block.align || 'center'}" icon-size="${block.iconSize || '24px'}" inner-padding="${block.innerPadding || '6px'}" padding="12px 0px">\n${elementsHtml}\n  </mj-social>`;
		},
		toReactEmail: (block: SocialBlock) => {
			const links = (block.networks || [])
				.map(
					(item) =>
						`              <Link href="${item.url || '#'}" className="text-gray-600 hover:text-gray-900 capitalize mx-2 text-xs font-semibold">\n                ${item.network}\n              </Link>`
				)
				.join('\n');
			const alignClass =
				block.align === 'center'
					? 'text-center'
					: block.align === 'right'
						? 'text-right'
						: 'text-left';
			return `            <Section className="${alignClass} my-3">\n${links}\n            </Section>`;
		}
	},
	raw: {
		toMjml: (block: RawBlock, context?: BlockRenderContext) => {
			const blockClass = context?.forCanvas ? `css-class="mf-selectable mf-id-${block.id}"` : '';
			return `<mj-raw ${blockClass}>${block.content || ''}</mj-raw>`;
		},
		toReactEmail: (block: RawBlock) => {
			return `            <div dangerouslySetInnerHTML={{ __html: \`${(block.content || '').replace(/`/g, '\\`')}\` }} />`;
		}
	},
	divider: {
		toMjml: (block: DividerBlock, context?: BlockRenderContext) => {
			const blockClass = context?.forCanvas ? `css-class="mf-selectable mf-id-${block.id}"` : '';
			return `<mj-divider ${blockClass} border-width="1px" border-color="#e2e8f0" padding="16px 0px" />`;
		},
		toReactEmail: () => {
			return `            <Hr className="border-gray-200 my-4" />`;
		}
	},
	spacer: {
		toMjml: (block: SpacerBlock, context?: BlockRenderContext) => {
			const blockClass = context?.forCanvas ? `css-class="mf-selectable mf-id-${block.id}"` : '';
			return `<mj-spacer ${blockClass} height="${block.height || '24px'}" />`;
		},
		toReactEmail: (block: SpacerBlock) => {
			return `            <Section style={{ height: '${block.height || '24px'}' }} />`;
		}
	}
};
