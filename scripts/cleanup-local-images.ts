#!/usr/bin/env node

import { readFile, unlink, readdir, appendFile } from 'fs/promises';
import { join } from 'path';

interface MigrationMapEntry {
  oldPath: string;
  localFile: string;
  blobUrl: string;
  uploadedAt: string;
  fileSize: number;
}

const MIGRATION_MAP_PATH = join(process.cwd(), 'scripts', 'blob-migration-map.json');
const RECIPES_DATA_PATH = join(process.cwd(), 'lib', 'recipesData.ts');
const RECIPES_DIR = join(process.cwd(), 'public', 'images', 'recipes');
const GITIGNORE_PATH = join(process.cwd(), '.gitignore');

async function cleanupLocalImages() {
  console.log('🧹 Starting local image cleanup...\n');

  try {
    // Step 1: Verify all recipes use Blob URLs
    console.log('🔍 Step 1: Verifying all recipes use Blob URLs...');
    const recipesContent = await readFile(RECIPES_DATA_PATH, 'utf-8');
    
    const hasLocalPaths = recipesContent.includes('"/images/recipes/');
    if (hasLocalPaths) {
      console.error('\n❌ Error: Some recipes still use local image paths');
      console.error('   Cannot proceed with cleanup');
      console.error('\n   Run: npm run blob:update-urls first');
      process.exit(1);
    }
    console.log('   ✅ All recipes use Blob URLs\n');

    // Step 2: Confirm all images migrated successfully
    console.log('🔍 Step 2: Checking migration map...');
    const mapContent = await readFile(MIGRATION_MAP_PATH, 'utf-8');
    const migrationMap: MigrationMapEntry[] = JSON.parse(mapContent);
    console.log(`   ✅ ${migrationMap.length} images migrated successfully\n`);

    if (migrationMap.length === 0) {
      console.log('⚠️  No migrations found. Nothing to clean up.');
      return;
    }

    // Step 3: Delete local images
    console.log('🗑️  Step 3: Deleting local image files...');
    const deletedFiles: string[] = [];
    const failedFiles: string[] = [];

    for (const mapping of migrationMap) {
      const filePath = mapping.localFile;
      try {
        await unlink(filePath);
        deletedFiles.push(filePath);
        console.log(`   ✅ Deleted: ${filePath}`);
      } catch (error: any) {
        failedFiles.push(filePath);
        console.error(`   ❌ Failed to delete: ${filePath} (${error.message})`);
      }
    }

    // Step 4: Update .gitignore
    console.log('\n📝 Step 4: Updating .gitignore...');
    try {
      const gitignoreContent = await readFile(GITIGNORE_PATH, 'utf-8');
      
      if (!gitignoreContent.includes('public/images/recipes/*.jpg')) {
        const gitignoreAddition = `
# Recipe images (now stored in Vercel Blob)
public/images/recipes/*.jpg
public/images/recipes/*.jpeg
public/images/recipes/*.png
public/images/recipes/*.webp
public/images/recipes/*.avif
`;
        await appendFile(GITIGNORE_PATH, gitignoreAddition);
        console.log('   ✅ Updated .gitignore');
      } else {
        console.log('   ℹ️  .gitignore already configured');
      }
    } catch (error) {
      console.error('   ⚠️  Warning: Could not update .gitignore');
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 Cleanup Summary');
    console.log('='.repeat(60));
    console.log(`✅ Deleted: ${deletedFiles.length} files`);
    console.log(`❌ Failed: ${failedFiles.length} files`);
    console.log(`📁 Total: ${migrationMap.length} files`);

    if (failedFiles.length > 0) {
      console.log('\n⚠️  Some files could not be deleted:');
      failedFiles.forEach((file) => console.log(`   - ${file}`));
    }

    console.log('\n✨ Cleanup complete!');
    console.log('\nNext steps:');
    console.log('  1. Run: npm run blob:validate');
    console.log('  2. Test your application locally');
    console.log('  3. Commit changes to git');
  } catch (error: any) {
    if (error.code === 'ENOENT' && error.path?.includes('blob-migration-map.json')) {
      console.error('\n❌ Error: Migration map not found');
      console.error('   Run: npm run blob:upload first');
    } else if (error.code === 'ENOENT' && error.path?.includes('recipesData.ts')) {
      console.error('\n❌ Error: recipesData.ts not found');
    } else {
      console.error('\n💥 Cleanup failed:', error.message);
    }
    process.exit(1);
  }
}

// Run cleanup
cleanupLocalImages().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
