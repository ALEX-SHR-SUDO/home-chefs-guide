#!/usr/bin/env ts-node

import { extractTitles } from './extract-titles';
import { parseRecipes } from './generate-recipe';
import { addRecipes } from './add-recipes';

const args = process.argv.slice(2);
const command = args[0];

async function main() {
  console.log('\n' + '='.repeat(60));
  console.log('🍳 Home Chef\'s Guide - Recipe OCR Automation');
  console.log('='.repeat(60) + '\n');
  
  switch (command) {
    case 'extract':
      console.log('📸 Step 1: Extracting titles from recipe images...\n');
      await extractTitles();
      console.log('\n✅ Extraction complete!');
      console.log('💡 Next step: Run "npm run ocr:parse" to generate recipes\n');
      break;
      
    case 'parse':
      console.log('🤖 Step 2: Generating recipes with AI...\n');
      console.log('⚠️  Note: This requires OPENAI_API_KEY environment variable\n');
      await parseRecipes();
      console.log('\n✅ Recipe generation complete!');
      console.log('💡 Next step: Run "npm run ocr:add" to add recipes to database\n');
      break;
      
    case 'add':
      console.log('📝 Step 3: Adding recipes to database...\n');
      await addRecipes();
      console.log('\n✅ All done! Recipes have been added to lib/recipesData.ts\n');
      break;
      
    case 'full':
      console.log('🚀 Running full pipeline...\n');
      
      console.log('📸 Step 1/3: Extracting titles from recipe images...');
      await extractTitles();
      console.log('✅ Step 1 complete!\n');
      
      console.log('🤖 Step 2/3: Generating recipes with AI...');
      console.log('⚠️  Note: This requires OPENAI_API_KEY environment variable\n');
      await parseRecipes();
      console.log('✅ Step 2 complete!\n');
      
      console.log('📝 Step 3/3: Adding recipes to database...');
      await addRecipes();
      console.log('✅ Step 3 complete!\n');
      
      console.log('🎉 Full pipeline complete! All recipes have been processed.\n');
      break;
      
    default:
      console.log('Usage: npm run ocr:<command>');
      console.log('');
      console.log('Commands:');
      console.log('  extract  - Extract titles from recipe images (Step 1)');
      console.log('  parse    - Generate recipes with AI (Step 2)');
      console.log('  add      - Add recipes to database (Step 3)');
      console.log('  full     - Run full pipeline (all steps)');
      console.log('');
      console.log('Examples:');
      console.log('  npm run ocr:extract');
      console.log('  npm run ocr:parse');
      console.log('  npm run ocr:add');
      console.log('  npm run ocr:full');
      console.log('');
      process.exit(1);
  }
}

main().catch(error => {
  console.error('\n❌ Fatal error:', error.message);
  console.error('\nStack trace:', error.stack);
  process.exit(1);
});
