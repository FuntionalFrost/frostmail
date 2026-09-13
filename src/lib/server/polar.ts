// src/lib/server/polar.ts
import { Polar } from '@polar-sh/sdk';
import { env } from '$env/dynamic/private';

export function usePolar(): Polar | null {
	const accessToken = env.POLAR_ACCESS_TOKEN || env.POLAR_API_KEY;

	if (!accessToken) {
		return null;
	}

	return new Polar({
		accessToken
	});
}
