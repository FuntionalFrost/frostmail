import tailwindcss from '@tailwindcss/vite';
import adapterVercel from '@sveltejs/adapter-vercel';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import adapterNode from '@sveltejs/adapter-node';

const isNode = process.env.DEPLOY_TARGET === 'node';

import path from 'node:path';
import { fileURLToPath } from 'node:url';

const yaxaDist = path.dirname(fileURLToPath(import.meta.resolve('yaxa-svelte')));

export default defineConfig({
	plugins: [
		{
			name: 'yaxa-internal-resolver',
			enforce: 'pre',
			resolveId(source, importer) {
				if (source.startsWith('#lib/') && importer && importer.includes('yaxa-svelte')) {
					const subpath = source.replace('#lib/', '');
					return path.resolve(yaxaDist, subpath);
				}
			}
		},
		tailwindcss(),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: true
			},
			adapter: isNode ? adapterNode() : adapterVercel({ runtime: 'nodejs24.x' })
		})
	]
});
