// src/lib/server/polar.ts
import { createPolar } from '@polar-sh/sdk/2026-10';
import { POLAR_ACCESS_TOKEN, POLAR_API_KEY } from '$app/env/private';

export type PolarClient = ReturnType<typeof createPolar>;

export function usePolar(): PolarClient | null {
	const accessToken = POLAR_ACCESS_TOKEN || POLAR_API_KEY;

	if (!accessToken) {
		return null;
	}

	return createPolar({
		accessToken
	});
}
