import { randomBytes } from 'node:crypto';
import { basename, extname } from 'node:path';

export function getDocumentTypeSlug(type: string): string {
  return type.toLowerCase().replace(/_/g, '-');
}

export function generateRandomSlug(length = 3): string {
  return randomBytes(length).toString('hex');
}

export function extractFilename(filePath: string): string {
  return basename(filePath);
}

export function generateDocumentFilename(documentType: string, originalFilename: string): string {
  const extension = extname(originalFilename);
  const docTypeSlug = getDocumentTypeSlug(documentType);
  const randomSlug = generateRandomSlug();

  return `${docTypeSlug}-${randomSlug}${extension}`;
}
