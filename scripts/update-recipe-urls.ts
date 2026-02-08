#!/usr/bin/env node

import { readFile, writeFile } from 'fs/promises';
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

async function updateRecipeUrls() {
  console.log('🔄 Starting recipe URL updates...\n');

  try {
    // Read migration map
    console.log('📖 Reading migration map...');
    const mapContent = await readFile(MIGRATION_MAP_PATH, 'utf-8');
    const migrationMap: MigrationMapEntry[] = JSON.parse(mapContent);
    console.log(`   Found ${migrationMap.length} mappings\n`);

    if (migrationMap.length === 0) {
      console.log('⚠️  No mappings found in migration map');
      console.log('   Run: npm run blob:upload first');
      process.exit(1);
    }

    // Read recipesData.ts
    console.log('📖 Reading recipesData.ts...');
    let recipesContent = await readFile(RECIPES_DATA_PATH, 'utf-8');
    const originalContent = recipesContent;

    // Replace each old path with new Blob URL
    let replacements = 0;
    for (const mapping of migrationMap) {
      const { oldPath, blobUrl } = mapping;
      
      // Use regex to find and replace the image path
      const regex = new RegExp(
        `"image":\\s*"${oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`,
        'g'
      );
      
      const matches = recipesContent.match(regex);
      if (matches) {
        recipesContent = recipesContent.replace(regex, `"image": "${blobUrl}"`);
        console.log(`   ✅ Updated: ${oldPath} → ${blobUrl}`);
        replacements += matches.length;
      } else {
        console.log(`   ⚠️  Not found: ${oldPath}`);
      }
    }

    // Save updated recipesData.ts
    if (replacements > 0) {
      console.log(`\n💾 Saving updated recipesData.ts...`);
      await writeFile(RECIPES_DATA_PATH, recipesContent, 'utf-8');
      console.log(`   ✅ ${replacements} URLs updated successfully`);
    } else {
      console.log('\n⚠️  No URLs were updated');
      console.log('   All recipes may already use Blob URLs');
    }

    // Validation
    console.log('\n🔍 Validating...');
    const stillHasLocalPaths = recipesContent.includes('"/images/recipes/');
    if (stillHasLocalPaths) {
      console.log('   ⚠️  Warning: Some local image paths still remain');
      console.log('   This may be expected if not all images were migrated');
    } else {
      console.log('   ✅ No local image paths detected');
    }

    console.log('\n✨ URL update complete!');
    console.log('\nNext steps:');
    console.log('  1. Review changes in lib/recipesData.ts');
    console.log('  2. Run: npm run blob:cleanup (to delete local images)');
    console.log('  3. Run: npm run blob:validate (to verify migration)');
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      console.error('\n❌ Error: Migration map not found');
      console.error('   Run: npm run blob:upload first');
    } else {
      console.error('\n💥 Update failed:', error.message);
    }
    process.exit(1);
  }
}

// Run update
updateRecipeUrls().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
