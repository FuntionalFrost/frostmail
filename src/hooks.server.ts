import { sequence, type Handle } from '@sveltejs/kit/hooks';
import { building } from '$app/env';
import { auth } from '#lib/server/auth.js';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { createYaxaHook } from 'yaxa-svelte/seo';
import { siteConfig } from '#lib/config/site.js';

const handleBetterAuth: Handle = async ({ event, resolve }) => {
	const session = await auth.api.getSession({ headers: event.request.headers });

	if (session) {
		event.locals.session = session.session;
		event.locals.user = session.user;
	}

	return svelteKitHandler({ event, resolve, auth, building });
};

const handleYaxa = createYaxaHook({
	config: siteConfig,
	sitemap: {
		config: siteConfig,
		staticRoutes: [
			{ loc: '/', priority: 1.0, changefreq: 'weekly' },
			{ loc: '/editor', priority: 0.9, changefreq: 'weekly' },
			{ loc: '/diagnostic', priority: 0.8, changefreq: 'weekly' },
			{ loc: '/privacy', priority: 0.3, changefreq: 'monthly' },
			{ loc: '/terms', priority: 0.3, changefreq: 'monthly' },
			{ loc: '/refunds', priority: 0.3, changefreq: 'monthly' },
			{ loc: '/impressum', priority: 0.3, changefreq: 'monthly' }
		]
	}
});

export const handle: Handle = sequence(handleYaxa, handleBetterAuth);
