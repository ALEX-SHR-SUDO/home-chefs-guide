#!/usr/bin/env ts-node

import * as fs from 'fs';
import * as path from 'path';
import { Recipe } from '../lib/types';
import config from './config.json';

/**
 * Load recipes from generated files
 */
function loadGeneratedRecipes(): Recipe[] {
  const recipesDir = path.join(process.cwd(), config.outputDirectory, 'recipes');
  
  if (!fs.existsSync(recipesDir)) {
    console.error('❌ Recipes directory not found. Please run generate-recipe.ts first.');
    return [];
  }
  
  const recipeFiles = fs.readdirSync(recipesDir)
    .filter(file => file.endsWith('.json') && !file.startsWith('_'));
  
  const recipes: Recipe[] = [];
  
  for (const file of recipeFiles) {
    const filePath = path.join(recipesDir, file);
    const recipe = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    recipes.push(recipe);
  }
  
  return recipes;
}

/**
 * Check if a recipe already exists in the data file
 */
function recipeExists(recipeId: string, existingContent: string): boolean {
  // Simple check - look for the recipe ID in the file
  return existingContent.includes(`"id": "${recipeId}"`);
}

/**
 * Create backup of recipesData.ts
 */
function createBackup(): string {
  const dataFilePath = path.join(process.cwd(), 'lib', 'recipesData.ts');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(process.cwd(), 'lib', `recipesData.backup.${timestamp}.ts`);
  
  fs.copyFileSync(dataFilePath, backupPath);
  console.log(`📦 Backup created: ${backupPath}\n`);
  
  return backupPath;
}

/**
 * Add recipes to recipesData.ts
 */
async function addRecipes(): Promise<void> {
  console.log('📝 Adding generated recipes to recipesData.ts...\n');
  
  const dataFilePath = path.join(process.cwd(), 'lib', 'recipesData.ts');
  
  if (!fs.existsSync(dataFilePath)) {
    console.error('❌ recipesData.ts not found at:', dataFilePath);
    process.exit(1);
  }
  
  // Load generated recipes
  const newRecipes = loadGeneratedRecipes();
  
  if (newRecipes.length === 0) {
    console.error('❌ No generated recipes found. Please run generate-recipe.ts first.');
    process.exit(1);
  }
  
  console.log(`📚 Found ${newRecipes.length} generated recipes\n`);
  
  // Read existing data file
  let existingContent = fs.readFileSync(dataFilePath, 'utf-8');
  
  // Create backup
  createBackup();
  
  // Filter out recipes that already exist
  const recipesToAdd = newRecipes.filter(recipe => {
    const exists = recipeExists(recipe.id, existingContent);
    if (exists) {
      console.log(`⚠️  Skipping "${recipe.title}" - already exists`);
    }
    return !exists;
  });
  
  if (recipesToAdd.length === 0) {
    console.log('\n✅ All recipes already exist in the data file. No changes needed.\n');
    return;
  }
  
  console.log(`\n➕ Adding ${recipesToAdd.length} new recipes:\n`);
  
  // Find the closing bracket of the array
  const arrayEndIndex = existingContent.lastIndexOf('];');
  
  if (arrayEndIndex === -1) {
    console.error('❌ Could not find array closing bracket in recipesData.ts');
    process.exit(1);
  }
  
  // Generate recipe entries
  const recipeEntries = recipesToAdd.map(recipe => {
    console.log(`   ✅ ${recipe.title} (${recipe.category})`);
    return '  ' + JSON.stringify(recipe, null, 2).replace(/\n/g, '\n  ');
  }).join(',\n');
  
  // Insert new recipes before the closing bracket
  const beforeArray = existingContent.substring(0, arrayEndIndex);
  const afterArray = existingContent.substring(arrayEndIndex);
  
  // Add comma after last existing recipe if needed
  const needsComma = beforeArray.trim().endsWith('}');
  const newContent = beforeArray + (needsComma ? ',\n' : '') + recipeEntries + '\n' + afterArray;
  
  // Write updated content
  fs.writeFileSync(dataFilePath, newContent);
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 Summary:');
  console.log(`   ✅ Successfully added: ${recipesToAdd.length} recipes`);
  console.log(`   ⚠️  Skipped (duplicates): ${newRecipes.length - recipesToAdd.length}`);
  console.log('='.repeat(60) + '\n');
  
  console.log(`✅ Recipes added to ${dataFilePath}\n`);
  
  // Save summary
  const summaryPath = path.join(process.cwd(), config.outputDirectory, '_add_recipes_summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    totalGenerated: newRecipes.length,
    added: recipesToAdd.length,
    skipped: newRecipes.length - recipesToAdd.length,
    addedRecipes: recipesToAdd.map(r => ({ id: r.id, title: r.title }))
  }, null, 2));
  
  console.log(`📄 Summary saved to: ${summaryPath}\n`);
}

// Run if called directly
if (require.main === module) {
  addRecipes().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { addRecipes };
