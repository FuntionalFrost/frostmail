// src/lib/server/polar.ts
import { Polar } from '@polar-sh/sdk';
import { POLAR_ACCESS_TOKEN, POLAR_API_KEY } from '$app/env/private';

export function usePolar(): Polar | null {
	const accessToken = POLAR_ACCESS_TOKEN || POLAR_API_KEY;

	if (!accessToken) {
		return null;
	}

	return new Polar({
		accessToken
	});
}
