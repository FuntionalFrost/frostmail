import { sequence, type Handle } from '@sveltejs/kit/hooks';
import { building } from '$app/env';
import { auth } from '#lib/server/auth.js';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { createYaxaHook } from 'yaxa-svelte';
import { siteConfig } from '#lib/config/site.js';

const handleBetterAuth: Handle = async ({ event, resolve }) => {
	const session = await auth.api.getSession({ headers: event.request.headers });

	if (session) {
		event.locals.session = session.session;
		event.locals.user = session.user;
	}

	return svelteKitHandler({ event, resolve, auth, building });
};

const handleYaxa = createYaxaHook(siteConfig);

export const handle: Handle = sequence(handleYaxa, handleBetterAuth);
