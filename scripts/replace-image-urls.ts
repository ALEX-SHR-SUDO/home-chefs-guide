#!/usr/bin/env tsx

import { readFile, writeFile, copyFile } from 'fs/promises';
import { join } from 'path';

const MAPPING_FILE = join(process.cwd(), 'scripts/image-mapping.json');
const RECIPES_FILE = join(process.cwd(), 'lib/recipesData.ts');

interface ImageMapping {
  [oldPath: string]: string;
}

async function replaceImageUrls(): Promise<void> {
  console.log('🔄 Starting URL replacement in recipesData.ts...\n');

  try {
    // Load mapping
    console.log('📂 Loading image mapping...');
    const mappingContent = await readFile(MAPPING_FILE, 'utf-8');
    const mapping: ImageMapping = JSON.parse(mappingContent);
    const mappingCount = Object.keys(mapping).length;
    console.log(`✅ Loaded ${mappingCount} image mappings\n`);

    if (mappingCount === 0) {
      console.error('❌ No image mappings found. Run migrate-images first.');
      process.exit(1);
    }

    // Create backup
    console.log('💾 Creating backup of recipesData.ts...');
    const backupPath = RECIPES_FILE + '.backup';
    await copyFile(RECIPES_FILE, backupPath);
    console.log(`✅ Backup saved to: ${backupPath}\n`);

    // Read recipes file
    console.log('📖 Reading recipesData.ts...');
    let content = await readFile(RECIPES_FILE, 'utf-8');
    const originalContent = content;

    // Replace URLs
    console.log('🔄 Replacing image URLs...\n');
    let replacementCount = 0;
    const replacements: Array<{ old: string; new: string }> = [];

    for (const [oldPath, newUrl] of Object.entries(mapping)) {
      // Match the old path in quotes (single or double)
      const regex = new RegExp(`["']${oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`, 'g');
      const matches = content.match(regex);
      
      if (matches) {
        content = content.replace(regex, `"${newUrl}"`);
        replacementCount += matches.length;
        replacements.push({ old: oldPath, new: newUrl });
        console.log(`  ✅ ${oldPath}`);
        console.log(`     -> ${newUrl}`);
      }
    }

    // Save updated file
    if (replacementCount > 0) {
      console.log(`\n💾 Saving updated recipesData.ts...`);
      await writeFile(RECIPES_FILE, content, 'utf-8');
      console.log(`✅ File saved successfully\n`);
    } else {
      console.log('\n⚠️  No URLs were replaced. File remains unchanged.\n');
    }

    // Print summary
    console.log('='.repeat(60));
    console.log('📊 Replacement Summary');
    console.log('='.repeat(60));
    console.log(`Total mappings available: ${mappingCount}`);
    console.log(`URLs replaced:            ${replacementCount}`);
    console.log(`Unique images updated:    ${replacements.length}`);
    console.log('='.repeat(60));

    if (replacementCount > 0) {
      console.log('\n✨ URL replacement completed successfully!');
      console.log('Next step: Run `npm run validate-migration` to verify all URLs work');
    } else {
      console.log('\n⚠️  No replacements were made. Check if URLs already updated or mapping is correct.');
    }
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      console.error('\n❌ Error: image-mapping.json not found');
      console.error('Please run `npm run migrate-images` first');
    } else {
      console.error('\n❌ Error:', error);
    }
    process.exit(1);
  }
}

// Run replacement
replaceImageUrls();
