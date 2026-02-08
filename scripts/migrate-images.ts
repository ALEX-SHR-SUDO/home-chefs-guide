#!/usr/bin/env tsx

import { readdir, readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { put } from '@vercel/blob';

interface ImageMapping {
  [oldPath: string]: string; // oldPath -> new Blob URL
}

interface MigrationStats {
  total: number;
  uploaded: number;
  skipped: number;
  failed: number;
  errors: Array<{ file: string; error: string }>;
}

const IMAGES_DIR = join(process.cwd(), 'public/images/recipes');
const MAPPING_FILE = join(process.cwd(), 'scripts/image-mapping.json');
const SUPPORTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.svg'];

async function loadExistingMapping(): Promise<ImageMapping> {
  try {
    const content = await readFile(MAPPING_FILE, 'utf-8');
    return JSON.parse(content);
  } catch {
    return {};
  }
}

async function saveMigrationReport(
  stats: MigrationStats,
  mapping: ImageMapping
): Promise<void> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportPath = join(process.cwd(), 'scripts', `migration-${timestamp}.log`);
  
  const report = `
📊 Image Migration Report
========================
Date: ${new Date().toLocaleString()}

Statistics:
-----------
Total images found: ${stats.total}
✅ Successfully uploaded: ${stats.uploaded}
⏭️  Skipped (already uploaded): ${stats.skipped}
❌ Failed: ${stats.failed}

${stats.errors.length > 0 ? `
Errors:
-------
${stats.errors.map(e => `❌ ${e.file}: ${e.error}`).join('\n')}
` : ''}

Mapping Summary:
---------------
${Object.entries(mapping).map(([old, newUrl]) => `${old} -> ${newUrl}`).join('\n')}
`;

  await writeFile(reportPath, report, 'utf-8');
  console.log(`\n📝 Report saved to: ${reportPath}`);
}

async function migrateImages(): Promise<void> {
  console.log('🚀 Starting image migration to Vercel Blob...\n');

  // Check for token
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error('❌ Error: BLOB_READ_WRITE_TOKEN environment variable is not set');
    console.error('Please set it in your .env.local file');
    process.exit(1);
  }

  // Load existing mapping
  const existingMapping = await loadExistingMapping();
  const mapping: ImageMapping = { ...existingMapping };
  
  const stats: MigrationStats = {
    total: 0,
    uploaded: 0,
    skipped: 0,
    failed: 0,
    errors: [],
  };

  try {
    // Read all files from images directory
    const files = await readdir(IMAGES_DIR);
    const imageFiles = files.filter(file => 
      SUPPORTED_EXTENSIONS.some(ext => file.toLowerCase().endsWith(ext))
    );

    stats.total = imageFiles.length;
    console.log(`📁 Found ${stats.total} images to migrate\n`);

    // Process each image
    for (let i = 0; i < imageFiles.length; i++) {
      const filename = imageFiles[i];
      const oldPath = `/images/recipes/${filename}`;
      
      console.log(`[${i + 1}/${imageFiles.length}] Processing: ${filename}`);

      // Check if already uploaded
      if (existingMapping[oldPath]) {
        console.log(`  ⏭️  Already uploaded, skipping...`);
        stats.skipped++;
        continue;
      }

      try {
        // Read file
        const filePath = join(IMAGES_DIR, filename);
        const fileBuffer = await readFile(filePath);
        
        // Determine content type
        const ext = filename.split('.').pop()?.toLowerCase();
        const contentTypeMap: { [key: string]: string } = {
          jpg: 'image/jpeg',
          jpeg: 'image/jpeg',
          png: 'image/png',
          webp: 'image/webp',
          svg: 'image/svg+xml',
        };
        const contentType = contentTypeMap[ext || 'jpg'] || 'image/jpeg';

        // Create File object
        const file = new File([fileBuffer], filename, { type: contentType });

        // Upload to Vercel Blob
        console.log(`  ⬆️  Uploading to Vercel Blob...`);
        const blob = await put(`recipes/${filename}`, file, {
          access: 'public',
          addRandomSuffix: false,
        });

        mapping[oldPath] = blob.url;
        stats.uploaded++;
        console.log(`  ✅ Success: ${blob.url}\n`);
      } catch (error) {
        stats.failed++;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        stats.errors.push({ file: filename, error: errorMessage });
        console.error(`  ❌ Failed: ${errorMessage}\n`);
      }
    }

    // Save mapping
    await mkdir(join(process.cwd(), 'scripts'), { recursive: true });
    await writeFile(MAPPING_FILE, JSON.stringify(mapping, null, 2), 'utf-8');
    console.log(`\n💾 Mapping saved to: ${MAPPING_FILE}`);

    // Generate report
    await saveMigrationReport(stats, mapping);

    // Print summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 Migration Summary');
    console.log('='.repeat(50));
    console.log(`Total images:     ${stats.total}`);
    console.log(`✅ Uploaded:       ${stats.uploaded}`);
    console.log(`⏭️  Skipped:        ${stats.skipped}`);
    console.log(`❌ Failed:         ${stats.failed}`);
    console.log('='.repeat(50));

    if (stats.failed > 0) {
      console.log('\n⚠️  Some images failed to upload. Check the report for details.');
      process.exit(1);
    } else {
      console.log('\n✨ Migration completed successfully!');
      console.log('Next step: Run `npm run replace-urls` to update recipesData.ts');
    }
  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run migration
migrateImages();
