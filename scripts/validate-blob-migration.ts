#!/usr/bin/env node

import { readFile, readdir } from 'fs/promises';
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

async function validateBlobMigration() {
  console.log('🔍 Starting Blob migration validation...\n');

  const issues: string[] = [];
  const warnings: string[] = [];
  let allPassed = true;

  try {
    // Check 1: All recipes have Blob URLs (not local paths)
    console.log('✓ Check 1: Verifying recipes use Blob URLs...');
    try {
      const recipesContent = await readFile(RECIPES_DATA_PATH, 'utf-8');
      
      const hasLocalPaths = recipesContent.includes('"/images/recipes/');
      if (hasLocalPaths) {
        issues.push('Some recipes still use local image paths (/images/recipes/)');
        allPassed = false;
      } else {
        console.log('  ✅ All recipes use Blob URLs\n');
      }
    } catch (error: any) {
      issues.push(`Cannot read recipesData.ts: ${error.message}`);
      allPassed = false;
    }

    // Check 2: All Blob URLs are accessible
    console.log('✓ Check 2: Checking Blob URL accessibility...');
    try {
      const recipesContent = await readFile(RECIPES_DATA_PATH, 'utf-8');
      const blobUrlRegex = /"image":\s*"(https:\/\/[^"]+\.public\.blob\.vercel-storage\.com[^"]+)"/g;
      const matches: RegExpExecArray[] = [];
      let match;
      while ((match = blobUrlRegex.exec(recipesContent)) !== null) {
        matches.push(match);
      }
      
      if (matches.length === 0) {
        issues.push('No Blob URLs found in recipesData.ts');
        allPassed = false;
      } else {
        console.log(`  Found ${matches.length} Blob URLs`);
        
        // Sample check first 5 URLs
        const urlsToCheck = matches.slice(0, 5).map(m => m[1]);
        let successCount = 0;
        let failCount = 0;
        
        for (const url of urlsToCheck) {
          try {
            const response = await fetch(url, { method: 'HEAD' });
            if (response.ok) {
              successCount++;
            } else {
              failCount++;
              warnings.push(`URL returned ${response.status}: ${url}`);
            }
          } catch (error: any) {
            failCount++;
            warnings.push(`URL check failed: ${url} (${error.message})`);
          }
        }
        
        console.log(`  ✅ Checked ${successCount}/${urlsToCheck.length} URLs (sample)\n`);
        
        if (failCount > 0) {
          warnings.push(`${failCount} URLs failed accessibility check`);
        }
      }
    } catch (error: any) {
      warnings.push(`URL accessibility check failed: ${error.message}`);
    }

    // Check 3: No broken image references
    console.log('✓ Check 3: Checking for broken references...');
    try {
      const recipesContent = await readFile(RECIPES_DATA_PATH, 'utf-8');
      
      // Check for empty image fields
      const emptyImageRegex = /"image":\s*""\s*,/g;
      const emptyMatches = recipesContent.match(emptyImageRegex);
      
      if (emptyMatches) {
        issues.push(`Found ${emptyMatches.length} recipes with empty image fields`);
        allPassed = false;
      } else {
        console.log('  ✅ No broken references found\n');
      }
    } catch (error: any) {
      warnings.push(`Broken reference check failed: ${error.message}`);
    }

    // Check 4: Local images directory is empty or has minimal files
    console.log('✓ Check 4: Checking local images directory...');
    try {
      const files = await readdir(RECIPES_DIR);
      const imageFiles = files.filter((file) =>
        /\.(jpg|jpeg|png|webp|avif)$/i.test(file)
      );
      
      if (imageFiles.length > 0) {
        warnings.push(`Local images directory still has ${imageFiles.length} image files`);
        console.log(`  ⚠️  ${imageFiles.length} images remain in local directory\n`);
      } else {
        console.log('  ✅ Local images directory is clean\n');
      }
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log('  ✅ Local images directory does not exist\n');
      } else {
        warnings.push(`Cannot check local directory: ${error.message}`);
      }
    }

    // Check 5: Migration map matches recipesData.ts
    console.log('✓ Check 5: Verifying migration map...');
    try {
      const mapContent = await readFile(MIGRATION_MAP_PATH, 'utf-8');
      const migrationMap: MigrationMapEntry[] = JSON.parse(mapContent);
      
      const recipesContent = await readFile(RECIPES_DATA_PATH, 'utf-8');
      
      let matchCount = 0;
      let mismatchCount = 0;
      
      for (const mapping of migrationMap) {
        if (recipesContent.includes(mapping.blobUrl)) {
          matchCount++;
        } else {
          mismatchCount++;
          warnings.push(`Blob URL not found in recipes: ${mapping.blobUrl}`);
        }
      }
      
      console.log(`  ✅ ${matchCount}/${migrationMap.length} URLs match\n`);
      
      if (mismatchCount > 0) {
        warnings.push(`${mismatchCount} migrated URLs not found in recipesData.ts`);
      }
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        warnings.push('Migration map not found - may not have run migration yet');
      } else {
        warnings.push(`Migration map check failed: ${error.message}`);
      }
    }

    // Display results
    console.log('='.repeat(60));
    console.log('📊 Validation Results');
    console.log('='.repeat(60));

    if (allPassed && issues.length === 0) {
      console.log('✅ ALL CHECKS PASSED');
    } else {
      console.log('❌ VALIDATION FAILED');
    }

    if (issues.length > 0) {
      console.log('\n❌ Issues:');
      issues.forEach((issue) => console.log(`   - ${issue}`));
    }

    if (warnings.length > 0) {
      console.log('\n⚠️  Warnings:');
      warnings.forEach((warning) => console.log(`   - ${warning}`));
    }

    if (allPassed && issues.length === 0 && warnings.length === 0) {
      console.log('\n🎉 Migration validation successful!');
      console.log('   All recipe images are using Vercel Blob storage');
    } else if (allPassed && issues.length === 0) {
      console.log('\n✅ Migration validation passed with warnings');
    }

    console.log('\n');
    
    if (!allPassed || issues.length > 0) {
      process.exit(1);
    }
  } catch (error: any) {
    console.error('\n💥 Validation failed:', error.message);
    process.exit(1);
  }
}

// Run validation
validateBlobMigration().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
