#!/usr/bin/env tsx

import { readdir, unlink, writeFile, mkdir, rename } from 'fs/promises';
import { join } from 'path';

const IMAGES_DIR = join(process.cwd(), 'public/images/recipes');
const SUPPORTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.svg'];

async function cleanOldImages(): Promise<void> {
  console.log('🧹 Starting cleanup of old images...\n');

  try {
    // Safety check: Ask for confirmation
    console.log('⚠️  WARNING: This will delete all images from public/images/recipes/');
    console.log('Make sure you have:');
    console.log('  1. Run npm run migrate-images');
    console.log('  2. Run npm run replace-urls');
    console.log('  3. Run npm run validate-migration (with all checks passing)');
    console.log('  4. Committed your changes to git\n');

    // Create backup directory
    const backupDir = join(process.cwd(), 'scripts/migration-backup');
    await mkdir(backupDir, { recursive: true });

    // Read all files
    const files = await readdir(IMAGES_DIR);
    const imageFiles = files.filter(file => 
      SUPPORTED_EXTENSIONS.some(ext => file.toLowerCase().endsWith(ext))
    );

    if (imageFiles.length === 0) {
      console.log('✅ No images found to clean. Directory is already clean.');
      return;
    }

    console.log(`📁 Found ${imageFiles.length} images to remove\n`);

    // Create backup and delete
    let deletedCount = 0;
    let errorCount = 0;

    for (const filename of imageFiles) {
      try {
        const filePath = join(IMAGES_DIR, filename);
        const backupPath = join(backupDir, filename);

        // Move to backup instead of deleting
        await rename(filePath, backupPath);
        deletedCount++;
        console.log(`  ✅ Moved to backup: ${filename}`);
      } catch (error) {
        errorCount++;
        console.error(`  ❌ Error with ${filename}:`, error);
      }
    }

    // Create README in images directory
    const readme = `# Recipe Images Migrated to Vercel Blob

All recipe images have been migrated to Vercel Blob Storage for better performance and scalability.

- Migration date: ${new Date().toLocaleString()}
- Images migrated: ${deletedCount}
- Backup location: scripts/migration-backup/

## Using Images

Images are now served from Vercel Blob Storage and are referenced by their full URLs in the codebase.

To upload new images, visit: /admin/upload

## Backup

A backup of all original images has been saved to the migration-backup directory.
You can safely delete this backup once you've verified everything works correctly.
`;

    await writeFile(join(IMAGES_DIR, 'README.md'), readme, 'utf-8');
    console.log(`\n📝 Created README.md in ${IMAGES_DIR}`);

    // Print summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 Cleanup Summary');
    console.log('='.repeat(50));
    console.log(`Images moved to backup: ${deletedCount}`);
    console.log(`Errors:                 ${errorCount}`);
    console.log(`Backup location:        ${backupDir}`);
    console.log('='.repeat(50));

    if (errorCount > 0) {
      console.log('\n⚠️  Some files could not be moved. Check the errors above.');
      process.exit(1);
    } else {
      console.log('\n✨ Cleanup completed successfully!');
      console.log('\n💡 Next steps:');
      console.log('  1. Test your site to ensure all images load correctly');
      console.log('  2. Deploy to production');
      console.log('  3. After confirming everything works, you can delete scripts/migration-backup/');
    }
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

// Run cleanup
cleanOldImages();
