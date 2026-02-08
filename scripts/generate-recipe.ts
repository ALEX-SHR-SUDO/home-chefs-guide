#!/usr/bin/env ts-node

import * as fs from 'fs';
import * as path from 'path';
import OpenAI from 'openai';
import { Recipe } from '../lib/types';
import { generateRecipeId } from '../lib/recipes';
import config from './config.json';

interface ExtractedData {
  filename: string;
  title: string;
  emoji: string;
}

interface RecipeGenerationResult {
  recipe: Recipe | null;
  error?: string;
}

/**
 * Initialize OpenAI client
 */
function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    console.error('❌ OPENAI_API_KEY environment variable is not set');
    console.error('   Please set it with: export OPENAI_API_KEY=your-api-key');
    return null;
  }
  
  return new OpenAI({ apiKey });
}

/**
 * Determine appropriate category and cuisine for a recipe
 */
function inferCategoryAndCuisine(title: string): { category: string; categorySlug: string; cuisine: string } {
  const titleLower = title.toLowerCase();
  
  // Breakfast items
  if (titleLower.includes('pancake') || titleLower.includes('waffle') || titleLower.includes('breakfast') ||
      titleLower.includes('omelette') || titleLower.includes('eggs') || titleLower.includes('bagel') ||
      titleLower.includes('toast') || titleLower.includes('chia pudding')) {
    return { category: 'Breakfast & Brunch', categorySlug: 'breakfast-brunch', cuisine: 'American' };
  }
  
  // Desserts
  if (titleLower.includes('cake') || titleLower.includes('pie') || titleLower.includes('pudding') ||
      titleLower.includes('cookie') || titleLower.includes('brownie') || titleLower.includes('tiramisu') ||
      titleLower.includes('banoffee')) {
    return { category: 'Desserts & Sweets', categorySlug: 'desserts', cuisine: 'International' };
  }
  
  // Breads
  if (titleLower.includes('bread') || titleLower.includes('naan') || titleLower.includes('brioche') ||
      titleLower.includes('baguette') || titleLower.includes('roll')) {
    return { category: 'Baking & Breads', categorySlug: 'baking-breads', cuisine: 'International' };
  }
  
  // Soups
  if (titleLower.includes('soup') || titleLower.includes('minestrone') || titleLower.includes('stew')) {
    return { category: 'Lunch Ideas', categorySlug: 'lunch', cuisine: 'International' };
  }
  
  // International dishes
  if (titleLower.includes('tagine') || titleLower.includes('moroccan')) {
    return { category: 'International Cuisine', categorySlug: 'international', cuisine: 'Moroccan' };
  }
  
  if (titleLower.includes('edamame')) {
    return { category: 'Appetizers & Snacks', categorySlug: 'appetizers-snacks', cuisine: 'Japanese' };
  }
  
  // Default
  return { category: 'Dinner Recipes', categorySlug: 'dinner', cuisine: 'International' };
}

/**
 * Generate recipe data using OpenAI API
 */
async function generateRecipeWithAI(extractedData: ExtractedData): Promise<RecipeGenerationResult> {
  const client = getOpenAIClient();
  
  if (!client) {
    return {
      recipe: null,
      error: 'OpenAI client not initialized'
    };
  }
  
  const { title, emoji } = extractedData;
  const { category, categorySlug, cuisine } = inferCategoryAndCuisine(title);
  
  const prompt = `You are a professional chef and recipe developer. Generate a complete, realistic recipe for "${title}".

Return ONLY a valid JSON object (no markdown, no explanations) with this exact structure:
{
  "description": "A compelling 2-3 sentence description of the dish",
  "prepTime": <number in minutes>,
  "cookTime": <number in minutes>,
  "servings": <number>,
  "difficulty": "Easy" | "Medium" | "Hard",
  "dietaryTags": [<array of relevant tags like "Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", "Low-Carb", etc.>],
  "ingredients": [<array of ingredient strings with measurements, e.g., "2 cups all-purpose flour">],
  "instructions": [<array of clear, step-by-step instructions>],
  "nutrition": {
    "calories": <number>,
    "protein": <number in grams>,
    "carbs": <number in grams>,
    "fat": <number in grams>
  },
  "tips": [<array of 2-3 helpful cooking tips>]
}

Make this recipe authentic, detailed, and practical. Include realistic measurements and cooking times.`;

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a professional chef who creates detailed, authentic recipes. Always respond with valid JSON only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });
    
    const content = response.choices[0]?.message?.content;
    
    if (!content) {
      return {
        recipe: null,
        error: 'No response from OpenAI'
      };
    }
    
    // Parse JSON response
    const parsedData = JSON.parse(content);
    
    // Calculate total time
    const totalTime = (parsedData.prepTime || 0) + (parsedData.cookTime || 0);
    
    // Generate ID and slug
    const recipeId = generateRecipeId(title);
    const slug = recipeId;
    
    // Construct full recipe
    const recipe: Recipe = {
      id: recipeId,
      title,
      slug,
      category,
      categorySlug,
      description: parsedData.description || `Delicious ${title.toLowerCase()} recipe.`,
      image: `/images/recipes/${extractedData.filename}`,
      prepTime: parsedData.prepTime || 15,
      cookTime: parsedData.cookTime || 30,
      totalTime,
      servings: parsedData.servings || 4,
      difficulty: parsedData.difficulty || config.defaultDifficulty,
      cuisine,
      dietaryTags: parsedData.dietaryTags || [],
      ingredients: parsedData.ingredients || [],
      instructions: parsedData.instructions || [],
      nutrition: parsedData.nutrition || { calories: 300, protein: 10, carbs: 40, fat: 10 },
      tips: parsedData.tips || [],
      datePublished: new Date().toISOString().split('T')[0],
      author: config.defaultAuthor
    };
    
    return { recipe };
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      recipe: null,
      error: `Failed to generate recipe: ${errorMessage}`
    };
  }
}

/**
 * Main function to parse all extracted titles
 */
async function parseRecipes(): Promise<void> {
  console.log('🤖 Starting recipe generation with AI...\n');
  
  const outputDir = path.join(process.cwd(), config.outputDirectory);
  const recipesDir = path.join(outputDir, 'recipes');
  
  // Ensure recipes directory exists
  if (!fs.existsSync(recipesDir)) {
    fs.mkdirSync(recipesDir, { recursive: true });
  }
  
  // Read extraction summary
  const summaryPath = path.join(outputDir, '_extraction_summary.json');
  
  if (!fs.existsSync(summaryPath)) {
    console.error('❌ Extraction summary not found. Please run extract-titles.ts first.');
    process.exit(1);
  }
  
  const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf-8'));
  const extractedData: ExtractedData[] = summary.extractedData || [];
  
  if (extractedData.length === 0) {
    console.error('❌ No extracted data found. Please run extract-titles.ts first.');
    process.exit(1);
  }
  
  console.log(`📝 Generating ${extractedData.length} recipes...\n`);
  
  const generatedRecipes: Recipe[] = [];
  const errors: string[] = [];
  
  for (const data of extractedData) {
    console.log(`🔄 Generating recipe for "${data.title}"...`);
    
    const result = await generateRecipeWithAI(data);
    
    if (result.recipe) {
      // Save recipe to file
      const recipeFile = path.join(recipesDir, `${result.recipe.id}.json`);
      fs.writeFileSync(recipeFile, JSON.stringify(result.recipe, null, 2));
      
      generatedRecipes.push(result.recipe);
      console.log(`   ✅ Generated and saved to ${path.basename(recipeFile)}`);
    } else {
      const errorMsg = `${data.title}: ${result.error}`;
      errors.push(errorMsg);
      console.log(`   ❌ ${result.error}`);
    }
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Generation Summary:');
  console.log(`   ✅ Successfully generated: ${generatedRecipes.length}`);
  console.log(`   ❌ Failed: ${errors.length}`);
  console.log('='.repeat(60) + '\n');
  
  if (errors.length > 0) {
    console.log('❌ Errors:');
    errors.forEach(err => console.log(`   - ${err}`));
    console.log();
  }
  
  // Save all recipes summary
  const recipesSummaryPath = path.join(recipesDir, '_recipes_summary.json');
  fs.writeFileSync(recipesSummaryPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    total: extractedData.length,
    successful: generatedRecipes.length,
    failed: errors.length,
    recipes: generatedRecipes.map(r => ({ id: r.id, title: r.title, category: r.category })),
    errors
  }, null, 2));
  
  console.log(`📄 Summary saved to: ${recipesSummaryPath}\n`);
}

// Run if called directly
if (require.main === module) {
  parseRecipes().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { parseRecipes, generateRecipeWithAI };
