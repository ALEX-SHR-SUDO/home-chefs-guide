#!/usr/bin/env tsx

import { list } from '@vercel/blob';

async function listBlobImages(): Promise<void> {
  console.log('📋 Listing images in Vercel Blob Storage...\n');

  // Check for token
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error('❌ Error: BLOB_READ_WRITE_TOKEN environment variable is not set');
    console.error('Please set it in your .env.local file');
    process.exit(1);
  }

  try {
    // List all blobs with recipes prefix
    const { blobs } = await list({
      prefix: 'recipes/',
    });

    if (blobs.length === 0) {
      console.log('No images found in Vercel Blob Storage.');
      console.log('Run `npm run migrate-images` to upload images.');
      return;
    }

    console.log(`Found ${blobs.length} images:\n`);
    console.log('='.repeat(100));
    console.log('Filename'.padEnd(50) + 'Size'.padEnd(15) + 'Uploaded');
    console.log('='.repeat(100));

    let totalSize = 0;

    for (const blob of blobs) {
      const filename = blob.pathname.split('/').pop() || blob.pathname;
      const sizeInMB = (blob.size / 1024 / 1024).toFixed(2);
      const uploadDate = new Date(blob.uploadedAt).toLocaleString();

      console.log(
        filename.padEnd(50) +
        `${sizeInMB} MB`.padEnd(15) +
        uploadDate
      );

      totalSize += blob.size;
    }

    console.log('='.repeat(100));
    console.log(`\nTotal: ${blobs.length} images, ${(totalSize / 1024 / 1024).toFixed(2)} MB\n`);

    // Show some example URLs
    console.log('Example URLs (first 3):');
    blobs.slice(0, 3).forEach(blob => {
      console.log(`  ${blob.url}`);
    });
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

// Run listing
listBlobImages();
