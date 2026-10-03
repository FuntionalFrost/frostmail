// src/lib/server/storage.ts
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'node:crypto';

import {
	R2_ACCOUNT_ID,
	R2_ACCESS_KEY_ID,
	AWS_ACCESS_KEY_ID,
	R2_SECRET_ACCESS_KEY,
	AWS_SECRET_ACCESS_KEY,
	R2_BUCKET_NAME,
	R2_PUBLIC_DOMAIN
} from '$app/env/private';

let s3ClientInstance: S3Client | null = null;

export function useStorageClient(): S3Client | null {
	if (s3ClientInstance) return s3ClientInstance;

	const accountId = R2_ACCOUNT_ID;
	const accessKeyId = R2_ACCESS_KEY_ID || AWS_ACCESS_KEY_ID;
	const secretAccessKey = R2_SECRET_ACCESS_KEY || AWS_SECRET_ACCESS_KEY;

	if (!accountId || !accessKeyId || !secretAccessKey) {
		return null;
	}

	s3ClientInstance = new S3Client({
		region: 'auto',
		endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
		credentials: {
			accessKeyId,
			secretAccessKey
		}
	});

	return s3ClientInstance;
}

export async function uploadEmailAsset(
	buffer: Buffer,
	mimeType: string,
	originalFilename?: string
): Promise<{ url: string; key: string; sizeKb: number }> {
	const bucketName = R2_BUCKET_NAME || 'frostmail-assets';
	const publicDomain = (R2_PUBLIC_DOMAIN || '').replace(/\/+$/, '');
	const ext = originalFilename?.split('.').pop() || mimeType.split('/')[1] || 'png';
	const key = `assets/${Date.now()}_${randomUUID().slice(0, 8)}.${ext}`;

	const client = useStorageClient();

	if (client) {
		await client.send(
			new PutObjectCommand({
				Bucket: bucketName,
				Key: key,
				Body: buffer,
				ContentType: mimeType,
				CacheControl: 'public, max-age=31536000, immutable'
			})
		);

		const url = publicDomain
			? `${publicDomain}/${key}`
			: `https://${bucketName}.${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${key}`;

		return {
			url,
			key,
			sizeKb: Number((buffer.length / 1024).toFixed(2))
		};
	}

	// Fallback for local sandbox / dev if R2 credentials are not set
	const base64Data = buffer.toString('base64');
	return {
		url: `data:${mimeType};base64,${base64Data}`,
		key,
		sizeKb: Number((buffer.length / 1024).toFixed(2))
	};
}
