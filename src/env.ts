import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	POLAR_WEBHOOK_SECRET: { schema: (input) => input ?? '' },
	POLAR_PRO_PRODUCT_ID: { schema: (input) => input ?? '' },
	RESEND_API_KEY: { schema: (input) => input ?? '' },
	ORIGIN: { schema: (input) => input ?? '' },
	BETTER_AUTH_SECRET: { schema: (input) => input ?? '' },
	GITHUB_CLIENT_ID: { schema: (input) => input ?? '' },
	GITHUB_CLIENT_SECRET: { schema: (input) => input ?? '' },
	POLAR_ACCESS_TOKEN: { schema: (input) => input ?? '' },
	POLAR_API_KEY: { schema: (input) => input ?? '' },
	R2_ACCOUNT_ID: { schema: (input) => input ?? '' },
	R2_ACCESS_KEY_ID: { schema: (input) => input ?? '' },
	AWS_ACCESS_KEY_ID: { schema: (input) => input ?? '' },
	R2_SECRET_ACCESS_KEY: { schema: (input) => input ?? '' },
	AWS_SECRET_ACCESS_KEY: { schema: (input) => input ?? '' },
	R2_BUCKET_NAME: { schema: (input) => input ?? '' },
	R2_PUBLIC_DOMAIN: { schema: (input) => input ?? '' },
	DATABASE_URL: { schema: (input) => input ?? '' }
});
