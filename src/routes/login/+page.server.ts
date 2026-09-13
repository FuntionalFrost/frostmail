// src/routes/login/+page.server.ts
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { auth } from '$lib/server/auth';
import { APIError } from 'better-auth/api';

export const load: PageServerLoad = (event) => {
	const callbackURL = event.url.searchParams.get('callbackURL') || '/editor';
	if (event.locals.user) {
		return redirect(302, callbackURL);
	}
	return { callbackURL };
};

export const actions: Actions = {
	signInEmail: async (event) => {
		const formData = await event.request.formData();
		const email = formData.get('email')?.toString() ?? '';
		const password = formData.get('password')?.toString() ?? '';
		const callbackURL = event.url.searchParams.get('callbackURL') || '/editor';

		if (!email || !password) {
			return fail(400, { message: 'Email and password are required.' });
		}

		try {
			await auth.api.signInEmail({
				body: {
					email,
					password,
					callbackURL
				}
			});
		} catch (error) {
			if (error instanceof APIError) {
				return fail(400, { message: error.message || 'Invalid email or password.' });
			}
			return fail(500, { message: 'Authentication service error. Please try again.' });
		}

		return redirect(302, callbackURL);
	},

	signUpEmail: async (event) => {
		const formData = await event.request.formData();
		const email = formData.get('email')?.toString() ?? '';
		const password = formData.get('password')?.toString() ?? '';
		const name = formData.get('name')?.toString() ?? '';
		const callbackURL = event.url.searchParams.get('callbackURL') || '/editor';

		if (!email || !password) {
			return fail(400, { message: 'Email and password are required.' });
		}

		try {
			await auth.api.signUpEmail({
				body: {
					email,
					password,
					name: name || email.split('@')[0] || 'User',
					callbackURL
				}
			});
		} catch (error) {
			if (error instanceof APIError) {
				return fail(400, {
					message: error.message || 'Registration failed. Email may already be in use.'
				});
			}
			return fail(500, { message: 'Registration service error. Please try again.' });
		}

		return redirect(302, callbackURL);
	},

	signInSocial: async (event) => {
		const formData = await event.request.formData();
		const provider = formData.get('provider')?.toString() ?? 'github';
		const callbackURL = event.url.searchParams.get('callbackURL') || '/editor';

		try {
			const result = await auth.api.signInSocial({
				body: {
					provider: provider as 'github',
					callbackURL
				}
			});

			if (result.url) {
				return redirect(302, result.url);
			}
			return fail(400, { message: 'Social sign-in provider returned an invalid response.' });
		} catch (error) {
			if (error instanceof APIError) {
				return fail(400, {
					message: error.message || 'GitHub OAuth failed. Please check credentials.'
				});
			}
			return fail(500, { message: 'OAuth service error. Please try again.' });
		}
	}
};
