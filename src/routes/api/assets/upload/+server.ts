// src/routes/api/assets/upload/+server.ts
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { uploadEmailAsset } from '#lib/server/storage.js';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB limit

export const POST: RequestHandler = async ({ request }) => {
	const formData = await request.formData().catch(() => null);

	if (!formData) {
		throw error(400, 'No multipart form data found in request.');
	}

	const file = formData.get('file') as File | null;

	if (!file || typeof file === 'string') {
		throw error(400, 'Missing file payload in form data.');
	}

	const mimeType = file.type || 'image/png';

	if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
		throw error(400, 'Unsupported format. Allowed: JPEG, PNG, WEBP, GIF, SVG.');
	}

	if (file.size > MAX_SIZE_BYTES) {
		throw error(400, 'File size exceeds 5 MB limit.');
	}

	const arrayBuffer = await file.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);

	const result = await uploadEmailAsset(buffer, mimeType, file.name);

	return Response.json({
		url: result.url,
		key: result.key,
		name: file.name || 'uploaded_image',
		sizeKb: result.sizeKb
	});
};
