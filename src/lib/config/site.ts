// src/lib/config/site.ts
import { defineSiteConfig } from 'yaxa-svelte';

export const siteConfig = defineSiteConfig({
	name: 'FrostMail',
	title: 'FrostMail — Open Source Visual Transactional Email Studio & Deliverability Auditor',
	description:
		'Design responsive MJML emails, preview dynamic merge variables, audit DNS authentication records (SPF, DKIM, DMARC, MX), and dispatch test emails.',
	url: 'https://frostmail.vercel.app',
	email: 'devfrost@protonmail.com',
	version: '1.0.0',
	defaultLocale: 'en',
	logo: '/favicon.svg',
	author: {
		name: 'FunctionalFrost',
		url: 'https://github.com/FuntionalFrost',
		email: 'devfrost@protonmail.com',
		github: 'https://github.com/FuntionalFrost'
	},
	project: {
		license: 'MIT',
		type: 'open-source',
		pricingModel: 'free',
		repositoryUrl: 'https://github.com/FuntionalFrost/',
		isAccessibleForFree: true,
		badge: '100% Free & Open Source'
	},
	company: {
		legalName: 'FrostMail Open Source',
		contactEmail: 'devfrost@protonmail.com',
		representative: 'FunctionalFrost'
	},
	legal: {
		jurisdiction: 'EU',
		paymentProcessor: 'none',
		adNetwork: 'ethicalads',
		analytics: 'none',
		refundDays: 0,
		dpoEmail: 'devfrost@protonmail.com',
		links: {
			privacy: '/privacy',
			terms: '/terms',
			refunds: '/refunds',
			impressum: '/impressum'
		}
	},
	theme: {
		primaryColor: '#ff3e00',
		neutralColor: '#18181b',
		defaultMode: 'system'
	},
	seo: {
		titleTemplate: '%s | FrostMail',
		defaultOgImage: '/api/og',
		twitterCard: 'summary_large_image',
		keywords: [
			'email builder',
			'mjml editor',
			'transactional email studio',
			'email deliverability auditor',
			'spf dkim dmarc validator',
			'sveltekit email builder',
			'react email converter',
			'resend email testing',
			'email design tool',
			'polar merchant of record',
			'yaxa-svelte'
		],
		robots: {
			index: true,
			follow: true
		}
	},
	sitemap: {
		changefreq: 'weekly',
		priority: 0.9,
		exclude: ['/demo/*', '/api/*']
	},
	robots: {
		rules: [
			{
				userAgent: '*',
				allow: ['/'],
				disallow: ['/api/*', '/demo/*']
			}
		]
	},
	nav: [
		{ label: 'Editor Studio', href: '/editor' },
		{ label: 'DNS Auditor', href: '/diagnostic' }
	],
	socials: {
		github: 'https://github.com/FuntionalFrost/'
	}
});
