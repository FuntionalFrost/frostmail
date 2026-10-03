// src/lib/blocks/social.ts
import type { SocialBlock } from '#lib/types/email.js';
import type { BlockPlugin } from './types';
import { Share2 } from '@lucide/svelte';
import SocialBlockInspector from '#lib/components/inspectors/SocialBlockInspector.svelte';

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

export const socialBlockPlugin: BlockPlugin<SocialBlock> = {
	type: 'social',
	label: 'Social Links',
	category: 'content',
	icon: Share2,
	factory: () => ({
		id: `soc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
		type: 'social',
		align: 'center',
		iconSize: '24px',
		innerPadding: '6px',
		networks: [
			{
				id: `net_1_${Date.now()}`,
				network: 'x',
				url: 'https://x.com'
			},
			{
				id: `net_2_${Date.now()}`,
				network: 'github',
				url: 'https://github.com'
			},
			{
				id: `net_3_${Date.now()}`,
				network: 'linkedin',
				url: 'https://linkedin.com'
			}
		]
	}),
	toMjml: (block, context) => {
		const blockClass = context?.forCanvas ? `css-class="mf-selectable mf-id-${block.id}"` : '';
		const elementsHtml = (block.networks || [])
			.map((item) => {
				const mjmlName = mapNetworkToMjmlName(item.network);
				return `    <mj-social-element name="${mjmlName}" href="${item.url || '#'}" />`;
			})
			.join('\n');

		return `<mj-social ${blockClass} align="${block.align || 'center'}" icon-size="${block.iconSize || '24px'}" inner-padding="${block.innerPadding || '6px'}" padding="12px 0px">\n${elementsHtml}\n  </mj-social>`;
	},
	toReactEmail: (block) => {
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
	},
	inspector: SocialBlockInspector
};
