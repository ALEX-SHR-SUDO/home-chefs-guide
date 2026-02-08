#!/usr/bin/env tsx

import { readFile } from 'fs/promises';
import { join } from 'path';

const MAPPING_FILE = join(process.cwd(), 'scripts/image-mapping.json');
const RECIPES_FILE = join(process.cwd(), 'lib/recipesData.ts');

interface ImageMapping {
  [oldPath: string]: string;
}

interface ValidationResult {
  url: string;
  status: 'success' | 'failed';
  statusCode?: number;
  error?: string;
}

async function checkUrlAccessibility(url: string): Promise<ValidationResult> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return {
      url,
      status: response.ok ? 'success' : 'failed',
      statusCode: response.status,
    };
  } catch (error) {
    return {
      url,
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

async function validateMigration(): Promise<void> {
  console.log('🔍 Starting migration validation...\n');

  try {
    // Load mapping
    console.log('📂 Loading image mapping...');
    const mappingContent = await readFile(MAPPING_FILE, 'utf-8');
    const mapping: ImageMapping = JSON.parse(mappingContent);
    const urls = Object.values(mapping);
    console.log(`✅ Found ${urls.length} URLs to validate\n`);

    // Read recipes file
    console.log('📖 Reading recipesData.ts...');
    const recipesContent = await readFile(RECIPES_FILE, 'utf-8');

    // Check if old paths still exist in file
    console.log('🔍 Checking for old image paths...\n');
    const oldPaths = Object.keys(mapping);
    const stillUsingOldPaths = oldPaths.filter(oldPath => {
      // Look for the old path in quotes
      return recipesContent.includes(`"${oldPath}"`) || recipesContent.includes(`'${oldPath}'`);
    });

    if (stillUsingOldPaths.length > 0) {
      console.log('⚠️  Found old paths still in use:');
      stillUsingOldPaths.forEach(path => console.log(`   - ${path}`));
      console.log('\n⚠️  Please run `npm run replace-urls` to update these paths\n');
    } else {
      console.log('✅ No old paths found in recipesData.ts\n');
    }

    // Check if all new URLs are present
    console.log('🔍 Checking if new Blob URLs are in recipesData.ts...\n');
    const missingUrls = urls.filter(url => !recipesContent.includes(url));
    
    if (missingUrls.length > 0) {
      console.log(`⚠️  ${missingUrls.length} Blob URLs not found in recipesData.ts:`);
      missingUrls.slice(0, 5).forEach(url => console.log(`   - ${url}`));
      if (missingUrls.length > 5) {
        console.log(`   ... and ${missingUrls.length - 5} more`);
      }
      console.log();
    } else {
      console.log('✅ All Blob URLs found in recipesData.ts\n');
    }

    // Validate URL accessibility with concurrent requests
    console.log('🌐 Validating URL accessibility (this may take a while)...\n');
    const results: ValidationResult[] = [];
    
    // Process in batches to avoid rate limiting
    const batchSize = 10;
    for (let i = 0; i < urls.length; i += batchSize) {
      const batch = urls.slice(i, Math.min(i + batchSize, urls.length));
      process.stdout.write(`\r[${i}/${urls.length}] Checking URLs...`);
      
      // Check batch concurrently
      const batchResults = await Promise.all(
        batch.map(url => checkUrlAccessibility(url))
      );
      results.push(...batchResults);
      
      // Small delay between batches to be nice to the server
      if (i + batchSize < urls.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    console.log('\n');

    const successCount = results.filter(r => r.status === 'success').length;
    const failedResults = results.filter(r => r.status === 'failed');

    // Print failed URLs
    if (failedResults.length > 0) {
      console.log('❌ Failed URLs:');
      failedResults.forEach(result => {
        console.log(`   ${result.url}`);
        console.log(`   Reason: ${result.error || `HTTP ${result.statusCode}`}\n`);
      });
    }

    // Print summary
    console.log('='.repeat(70));
    console.log('📊 Validation Summary');
    console.log('='.repeat(70));
    console.log(`Total images in mapping:       ${urls.length}`);
    console.log(`Old paths still in use:        ${stillUsingOldPaths.length}`);
    console.log(`New URLs not in recipesData:   ${missingUrls.length}`);
    console.log(`URLs accessible:               ${successCount}`);
    console.log(`URLs not accessible:           ${failedResults.length}`);
    console.log('='.repeat(70));

    const allValid = stillUsingOldPaths.length === 0 && 
                     missingUrls.length === 0 && 
                     failedResults.length === 0;

    if (allValid) {
      console.log('\n✅ Migration validation passed! All images are migrated and accessible.');
      console.log('Next step: Run `npm run clean-images` to remove old images');
    } else {
      console.log('\n⚠️  Migration validation found issues. Please fix them before cleaning old images.');
      process.exit(1);
    }
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      console.error('\n❌ Error: Required files not found');
      console.error('Please run `npm run migrate-images` first');
    } else {
      console.error('\n❌ Error:', error);
    }
    process.exit(1);
  }
}

// Run validation
validateMigration();
