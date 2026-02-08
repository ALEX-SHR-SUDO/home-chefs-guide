#!/usr/bin/env node

import { put } from '@vercel/blob';
import { readdir, readFile, writeFile, copyFile } from 'fs/promises';
import { join, extname, basename } from 'path';

interface MigrationMapEntry {
  oldPath: string;
  localFile: string;
  blobUrl: string;
  uploadedAt: string;
  fileSize: number;
}

const RECIPES_DIR = join(process.cwd(), 'public', 'images', 'recipes');
const MIGRATION_MAP_PATH = join(process.cwd(), 'scripts', 'blob-migration-map.json');

/**
 * Get backup directory - use /tmp for serverless/read-only environments
 */
function getBackupDir(): string {
  // In serverless environments, the filesystem is read-only except for /tmp
  // Detect serverless environments by checking for:
  // 1. AWS Lambda: /var/task working directory
  // 2. Vercel: VERCEL environment variable
  // 3. Generic Lambda: AWS_LAMBDA_FUNCTION_NAME environment variable
  const isServerless = 
    process.cwd().startsWith('/var/task') ||
    process.env.VERCEL === '1' ||
    !!process.env.AWS_LAMBDA_FUNCTION_NAME;
  
  if (isServerless) {
    return '/tmp';
  }
  
  return join(process.cwd(), 'lib');
}

const BACKUP_PATH = join(getBackupDir(), 'recipesData.backup.ts');

async function migrateImagesToBlob() {
  console.log('🚀 Starting image migration to Vercel Blob...\n');

  // Check for BLOB_READ_WRITE_TOKEN
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error('❌ Error: BLOB_READ_WRITE_TOKEN environment variable is not set');
    console.error('   Please set it in your .env.local file or environment');
    process.exit(1);
  }

  try {
    // Create backup of recipesData.ts
    console.log('📦 Creating backup of recipesData.ts...');
    try {
      await copyFile(
        join(process.cwd(), 'lib', 'recipesData.ts'),
        BACKUP_PATH
      );
      console.log(`✅ Backup created at ${BACKUP_PATH}\n`);
    } catch (error: any) {
      console.warn('⚠️  Warning: Could not create backup:', error.message);
      console.warn('   Continuing migration without backup...\n');
    }

    // Read all images from recipes directory
    console.log('📂 Reading images from public/images/recipes/...');
    const files = await readdir(RECIPES_DIR);
    const imageFiles = files.filter((file) =>
      /\.(jpg|jpeg|png|webp|avif)$/i.test(file)
    );

    console.log(`   Found ${imageFiles.length} image files\n`);

    if (imageFiles.length === 0) {
      console.log('ℹ️  No images found to migrate');
      return;
    }

    const migrationMap: MigrationMapEntry[] = [];
    const results = {
      success: 0,
      failed: 0,
      errors: [] as { file: string; error: string }[],
    };

    // Upload each image
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const filePath = join(RECIPES_DIR, file);
      const oldPath = `/images/recipes/${file}`;

      console.log(`[${i + 1}/${imageFiles.length}] Uploading ${file}...`);

      try {
        // Read file
        const fileBuffer = await readFile(filePath);
        const fileSize = fileBuffer.length;

        // Generate unique filename
        const timestamp = Date.now();
        const ext = extname(file);
        const nameWithoutExt = basename(file, ext);
        const sanitizedNameWithoutExt = nameWithoutExt.replace(/[^a-z0-9-]/gi, '-').toLowerCase();
        const blobFilename = `recipes/${timestamp}-${sanitizedNameWithoutExt}${ext}`;

        // Upload to Blob
        const blob = await put(blobFilename, fileBuffer, {
          access: 'public',
          addRandomSuffix: false,
          contentType: getContentType(ext),
        });

        // Add to migration map
        migrationMap.push({
          oldPath,
          localFile: filePath,
          blobUrl: blob.url,
          uploadedAt: new Date().toISOString(),
          fileSize,
        });

        console.log(`   ✅ Success: ${blob.url}`);
        results.success++;

        // Rate limiting - wait 100ms between uploads
        if (i < imageFiles.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      } catch (error: any) {
        console.error(`   ❌ Failed: ${error.message}`);
        results.failed++;
        results.errors.push({
          file,
          error: error.message,
        });
      }
    }

    // Save migration map
    console.log('\n💾 Saving migration map...');
    await writeFile(
      MIGRATION_MAP_PATH,
      JSON.stringify(migrationMap, null, 2),
      'utf-8'
    );
    console.log(`   ✅ Saved to ${MIGRATION_MAP_PATH}`);

    // Display summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 Migration Summary');
    console.log('='.repeat(60));
    console.log(`✅ Successful: ${results.success}`);
    console.log(`❌ Failed: ${results.failed}`);
    console.log(`📁 Total: ${imageFiles.length}`);

    if (results.errors.length > 0) {
      console.log('\n❌ Errors:');
      results.errors.forEach(({ file, error }) => {
        console.log(`   - ${file}: ${error}`);
      });
    }

    console.log('\n✨ Migration complete!');
    console.log('\nNext steps:');
    console.log('  1. Run: npm run blob:update-urls');
    console.log('  2. Run: npm run blob:cleanup');
    console.log('  3. Run: npm run blob:validate');
  } catch (error: any) {
    console.error('\n💥 Migration failed:', error.message);
    process.exit(1);
  }
}

function getContentType(ext: string): string {
  const contentTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.avif': 'image/avif',
  };
  return contentTypes[ext.toLowerCase()] || 'image/jpeg';
}

// Run migration
migrateImagesToBlob().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
