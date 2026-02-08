#!/usr/bin/env ts-node

/**
 * Update existing recipes in recipesData.ts with improved data
 */

import * as fs from 'fs';
import * as path from 'path';
import { Recipe } from '../lib/types';
import config from './config.json';

/**
 * Load recipes from generated files
 */
function loadGeneratedRecipes(): Map<string, Recipe> {
  const recipesDir = path.join(process.cwd(), config.outputDirectory, 'recipes');
  
  if (!fs.existsSync(recipesDir)) {
    console.error('❌ Recipes directory not found. Please run generate-demo.ts first.');
    return new Map();
  }
  
  const recipeFiles = fs.readdirSync(recipesDir)
    .filter(file => file.endsWith('.json') && !file.startsWith('_'));
  
  const recipes = new Map<string, Recipe>();
  
  for (const file of recipeFiles) {
    const filePath = path.join(recipesDir, file);
    const recipe = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    recipes.set(recipe.id, recipe);
  }
  
  return recipes;
}

/**
 * Update recipes in recipesData.ts
 */
async function updateRecipes(): Promise<void> {
  console.log('🔄 Updating recipes in recipesData.ts...\n');
  
  const dataFilePath = path.join(process.cwd(), 'lib', 'recipesData.ts');
  
  if (!fs.existsSync(dataFilePath)) {
    console.error('❌ recipesData.ts not found at:', dataFilePath);
    process.exit(1);
  }
  
  // Load generated recipes
  const newRecipes = loadGeneratedRecipes();
  
  if (newRecipes.size === 0) {
    console.error('❌ No generated recipes found. Please run generate-demo.ts first.');
    process.exit(1);
  }
  
  console.log(`📚 Found ${newRecipes.size} generated recipes to update\n`);
  
  // Read existing data file
  let content = fs.readFileSync(dataFilePath, 'utf-8');
  
  // Create backup
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(process.cwd(), 'lib', `recipesData.backup.${timestamp}.ts`);
  fs.copyFileSync(dataFilePath, backupPath);
  console.log(`📦 Backup created: ${backupPath}\n`);
  
  let updated = 0;
  
  // Update each recipe
  for (const [recipeId, newRecipe] of newRecipes) {
    // Find the recipe in the file
    const recipeRegex = new RegExp(
      `\\{\\s*"id":\\s*"${recipeId}"[^}]*(?:\\{[^}]*\\}[^}]*)*\\}`,
      'g'
    );
    
    if (recipeRegex.test(content)) {
      // Recipe exists, replace it
      const newRecipeJson = JSON.stringify(newRecipe, null, 2)
        .split('\n')
        .map((line, idx) => idx === 0 ? '  ' + line : '  ' + line)
        .join('\n');
      
      // More robust regex that handles nested objects
      const fullRecipeRegex = new RegExp(
        `(\\s*)\\{\\s*\\n\\s*"id":\\s*"${recipeId}",[\\s\\S]*?\\n\\s*"author":\\s*"[^"]*"\\s*\\n\\s*\\}`,
        ''
      );
      
      if (fullRecipeRegex.test(content)) {
        content = content.replace(fullRecipeRegex, newRecipeJson);
        console.log(`   ✅ Updated: ${newRecipe.title}`);
        updated++;
      } else {
        console.log(`   ⚠️  Could not update: ${newRecipe.title} (pattern not found)`);
      }
    } else {
      console.log(`   ⚠️  Not found: ${newRecipe.title}`);
    }
  }
  
  if (updated > 0) {
    // Write updated content
    fs.writeFileSync(dataFilePath, content);
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 Summary:');
    console.log(`   ✅ Successfully updated: ${updated} recipes`);
    console.log(`   ⚠️  Not updated: ${newRecipes.size - updated}`);
    console.log('='.repeat(60) + '\n');
    
    console.log(`✅ Recipes updated in ${dataFilePath}\n`);
  } else {
    console.log('\n❌ No recipes were updated. Check the patterns.\n');
  }
}

// Run if called directly
if (require.main === module) {
  updateRecipes().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { updateRecipes };
