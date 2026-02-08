#!/usr/bin/env ts-node

/**
 * Demo script to showcase recipe generation without requiring OpenAI API key
 * This generates mock recipes for testing purposes
 */

import * as fs from 'fs';
import * as path from 'path';
import { Recipe } from '../lib/types';
import { generateRecipeId } from '../lib/recipes';
import config from './config.json';

interface ExtractedData {
  filename: string;
  title: string;
  emoji: string;
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
 * Generate mock recipe templates for demonstration
 */
function generateMockRecipe(extractedData: ExtractedData): Recipe {
  const { title, emoji } = extractedData;
  const { category, categorySlug, cuisine } = inferCategoryAndCuisine(title);
  
  const recipeId = generateRecipeId(title);
  const slug = recipeId;
  
  // Mock recipe data - in production, this would come from OpenAI
  const mockRecipes: Record<string, Partial<Recipe>> = {
    'naan': {
      description: 'Soft and fluffy Indian flatbread, perfect for scooping up curries and dals. This traditional naan is baked to perfection with a golden, slightly charred exterior.',
      prepTime: 90,
      cookTime: 15,
      servings: 8,
      difficulty: 'Medium',
      dietaryTags: ['Vegetarian'],
      ingredients: [
        '3 cups all-purpose flour',
        '1 tsp salt',
        '1 tsp sugar',
        '1 packet active dry yeast',
        '1 cup warm water',
        '1/4 cup plain yogurt',
        '2 tbsp melted butter',
        '2 cloves garlic, minced (optional)',
        'Fresh cilantro for garnish'
      ],
      instructions: [
        'In a large bowl, combine warm water, sugar, and yeast. Let stand for 5 minutes until foamy.',
        'Add flour, salt, yogurt, and butter. Mix until dough forms.',
        'Knead the dough on a floured surface for 8-10 minutes until smooth and elastic.',
        'Place in a greased bowl, cover, and let rise for 1 hour until doubled in size.',
        'Preheat oven to 500°F with a pizza stone or baking sheet inside.',
        'Divide dough into 8 pieces. Roll each into an oval shape about 1/4 inch thick.',
        'Brush with melted butter and sprinkle with garlic if using.',
        'Bake on hot stone for 2-3 minutes until puffed and golden with charred spots.',
        'Brush with more butter and garnish with cilantro. Serve warm.'
      ],
      nutrition: { calories: 210, protein: 6, carbs: 38, fat: 4 },
      tips: [
        'For extra flavor, add nigella seeds or sesame seeds to the dough.',
        'If you don\'t have a pizza stone, use an inverted baking sheet.'
      ]
    },
    'tiramisu': {
      description: 'Classic Italian dessert with layers of coffee-soaked ladyfingers and rich mascarpone cream. This no-bake dessert is the perfect ending to any meal.',
      prepTime: 30,
      cookTime: 0,
      servings: 8,
      difficulty: 'Easy',
      dietaryTags: ['Vegetarian'],
      ingredients: [
        '6 large egg yolks',
        '3/4 cup sugar',
        '1 1/3 cups mascarpone cheese',
        '2 cups heavy cream',
        '2 cups strong espresso, cooled',
        '3 tbsp coffee liqueur (optional)',
        '24-30 ladyfinger cookies',
        'Unsweetened cocoa powder for dusting'
      ],
      instructions: [
        'Whisk egg yolks and sugar in a heatproof bowl over simmering water until thick and pale.',
        'Remove from heat and whisk in mascarpone until smooth. Set aside to cool.',
        'In a separate bowl, whip heavy cream to stiff peaks.',
        'Gently fold whipped cream into mascarpone mixture.',
        'Combine espresso and coffee liqueur in a shallow dish.',
        'Quickly dip each ladyfinger into coffee mixture (don\'t soak).',
        'Arrange half the ladyfingers in a 9x13 inch dish.',
        'Spread half the mascarpone mixture over ladyfingers.',
        'Repeat with another layer of dipped ladyfingers and remaining cream.',
        'Cover and refrigerate for at least 4 hours or overnight.',
        'Dust generously with cocoa powder before serving.'
      ],
      nutrition: { calories: 380, protein: 8, carbs: 42, fat: 20 },
      tips: [
        'Use room temperature mascarpone for easier mixing.',
        'The longer it chills, the better the flavors meld together.'
      ]
    },
    'banoffee-pie': {
      description: 'Decadent British dessert combining bananas, toffee, and cream in a buttery biscuit crust. This indulgent pie is sure to satisfy any sweet tooth.',
      prepTime: 25,
      cookTime: 0,
      servings: 8,
      difficulty: 'Easy',
      dietaryTags: ['Vegetarian'],
      ingredients: [
        '14 oz digestive biscuits or graham crackers',
        '1/2 cup melted butter',
        '1 can (14 oz) sweetened condensed milk',
        '3-4 ripe bananas, sliced',
        '2 cups heavy whipping cream',
        '2 tbsp powdered sugar',
        '1 tsp vanilla extract',
        'Dark chocolate shavings for garnish'
      ],
      instructions: [
        'Crush biscuits into fine crumbs and mix with melted butter.',
        'Press mixture into bottom and sides of a 9-inch pie dish.',
        'Refrigerate crust for 30 minutes.',
        'Make toffee: Place unopened condensed milk can in pot of boiling water for 2-3 hours (or use store-bought dulce de leche).',
        'Let toffee cool completely, then spread over biscuit base.',
        'Arrange banana slices over toffee layer.',
        'Whip cream with powdered sugar and vanilla until stiff peaks form.',
        'Spread or pipe whipped cream over bananas.',
        'Garnish with chocolate shavings.',
        'Refrigerate for at least 2 hours before serving.'
      ],
      nutrition: { calories: 520, protein: 7, carbs: 58, fat: 30 },
      tips: [
        'Slice bananas just before assembling to prevent browning.',
        'For extra flavor, drizzle caramel sauce on top before serving.'
      ]
    },
    'moroccan-tagine': {
      description: 'Aromatic North African stew slow-cooked with tender meat, vegetables, and warming spices. This traditional dish is bursting with exotic flavors.',
      prepTime: 20,
      cookTime: 90,
      servings: 6,
      difficulty: 'Medium',
      dietaryTags: [],
      ingredients: [
        '2 lbs lamb or chicken, cut into chunks',
        '2 onions, diced',
        '3 cloves garlic, minced',
        '2 carrots, sliced',
        '2 cups butternut squash, cubed',
        '1 can chickpeas, drained',
        '1 can diced tomatoes',
        '2 cups chicken broth',
        '1 tsp ground cumin',
        '1 tsp ground coriander',
        '1 tsp paprika',
        '1/2 tsp cinnamon',
        '1/2 tsp turmeric',
        'Salt and pepper to taste',
        'Fresh cilantro for garnish',
        'Couscous for serving'
      ],
      instructions: [
        'Heat oil in a large tagine or heavy pot over medium-high heat.',
        'Brown meat in batches, then set aside.',
        'Sauté onions and garlic until softened, about 5 minutes.',
        'Add all spices and cook for 1 minute until fragrant.',
        'Return meat to pot with tomatoes and broth.',
        'Bring to a boil, then reduce heat and simmer covered for 45 minutes.',
        'Add carrots, squash, and chickpeas.',
        'Continue cooking for 45 minutes until meat is tender and vegetables are cooked.',
        'Season with salt and pepper to taste.',
        'Garnish with fresh cilantro and serve over couscous.'
      ],
      nutrition: { calories: 420, protein: 32, carbs: 38, fat: 16 },
      tips: [
        'Use preserved lemons for authentic Moroccan flavor.',
        'This dish tastes even better the next day after flavors meld.'
      ]
    },
    'edamame': {
      description: 'Simply prepared Japanese soybeans, lightly salted and perfect as a healthy snack or appetizer. Quick to make and incredibly nutritious.',
      prepTime: 5,
      cookTime: 8,
      servings: 4,
      difficulty: 'Easy',
      dietaryTags: ['Vegetarian', 'Vegan', 'Gluten-Free'],
      ingredients: [
        '1 lb frozen edamame in pods',
        '2 tbsp sea salt',
        '1 tsp sesame oil (optional)',
        '1 tsp chili flakes (optional)',
        'Lemon wedges for serving'
      ],
      instructions: [
        'Bring a large pot of water to a boil.',
        'Add 1 tablespoon of salt to the water.',
        'Add frozen edamame and cook for 5-8 minutes.',
        'Drain well in a colander.',
        'Transfer to a serving bowl while still hot.',
        'Toss with remaining salt and sesame oil if using.',
        'Sprinkle with chili flakes if desired.',
        'Serve immediately with lemon wedges.'
      ],
      nutrition: { calories: 120, protein: 11, carbs: 10, fat: 5 },
      tips: [
        'Squeeze lemon juice over the pods for extra flavor.',
        'To eat, squeeze the beans out of the pods with your teeth.'
      ]
    },
    'monkey-bread': {
      description: 'Pull-apart bread made with bite-sized pieces of dough coated in cinnamon sugar and baked in a bundt pan. A sweet, gooey treat perfect for sharing.',
      prepTime: 20,
      cookTime: 35,
      servings: 10,
      difficulty: 'Easy',
      dietaryTags: ['Vegetarian'],
      ingredients: [
        '2 cans refrigerated biscuit dough',
        '1 cup granulated sugar',
        '2 tsp ground cinnamon',
        '1/2 cup butter, melted',
        '1 cup brown sugar',
        '1/2 tsp vanilla extract',
        'Optional: 1/2 cup chopped pecans'
      ],
      instructions: [
        'Preheat oven to 350°F. Grease a bundt pan.',
        'Cut each biscuit into quarters.',
        'Mix granulated sugar and cinnamon in a bowl.',
        'Roll each dough piece in cinnamon sugar.',
        'Layer coated dough pieces in prepared bundt pan.',
        'In a small saucepan, melt butter with brown sugar.',
        'Stir in vanilla and bring to a simmer.',
        'Pour butter mixture evenly over dough pieces.',
        'Sprinkle with pecans if using.',
        'Bake for 30-35 minutes until golden brown.',
        'Let cool for 5 minutes, then invert onto serving plate.',
        'Serve warm, pulling apart pieces to eat.'
      ],
      nutrition: { calories: 310, protein: 4, carbs: 52, fat: 11 },
      tips: [
        'Serve immediately while warm and gooey.',
        'Drizzle with cream cheese glaze for extra indulgence.'
      ]
    },
    'minestrone-soup': {
      description: 'Classic Italian vegetable soup loaded with beans, pasta, and fresh vegetables in a savory tomato broth. Hearty, healthy, and satisfying.',
      prepTime: 15,
      cookTime: 40,
      servings: 8,
      difficulty: 'Easy',
      dietaryTags: ['Vegetarian', 'Vegan'],
      ingredients: [
        '2 tbsp olive oil',
        '1 onion, diced',
        '2 carrots, diced',
        '2 celery stalks, diced',
        '3 cloves garlic, minced',
        '1 zucchini, diced',
        '1 can diced tomatoes',
        '1 can kidney beans, drained',
        '1 can cannellini beans, drained',
        '6 cups vegetable broth',
        '1 cup small pasta (ditalini or elbow)',
        '2 cups fresh spinach',
        '1 tsp dried oregano',
        '1 tsp dried basil',
        'Salt and pepper to taste',
        'Parmesan cheese for serving',
        'Fresh basil for garnish'
      ],
      instructions: [
        'Heat olive oil in a large pot over medium heat.',
        'Sauté onion, carrots, and celery until softened, about 8 minutes.',
        'Add garlic and cook for 1 minute.',
        'Add zucchini, tomatoes, beans, and broth.',
        'Stir in oregano and basil.',
        'Bring to a boil, then reduce heat and simmer for 20 minutes.',
        'Add pasta and cook according to package directions.',
        'Stir in spinach and cook until wilted, about 2 minutes.',
        'Season with salt and pepper.',
        'Serve hot with grated Parmesan and fresh basil.'
      ],
      nutrition: { calories: 220, protein: 10, carbs: 38, fat: 4 },
      tips: [
        'Add pasta just before serving to prevent it from getting mushy.',
        'This soup freezes well - just add pasta when reheating.'
      ]
    },
    'brioche': {
      description: 'Rich, buttery French bread with a tender, fluffy crumb and golden crust. Perfect for breakfast, sandwiches, or French toast.',
      prepTime: 30,
      cookTime: 30,
      servings: 12,
      difficulty: 'Hard',
      dietaryTags: ['Vegetarian'],
      ingredients: [
        '4 cups all-purpose flour',
        '1/3 cup sugar',
        '2 tsp salt',
        '2 packets active dry yeast',
        '1/2 cup warm milk',
        '6 large eggs',
        '1 1/2 cups butter, softened',
        '1 egg beaten with 1 tbsp water for egg wash'
      ],
      instructions: [
        'In mixer bowl, combine flour, sugar, salt, and yeast.',
        'Add warm milk and eggs. Mix with dough hook until combined.',
        'Knead on medium speed for 10 minutes until dough is smooth.',
        'Gradually add butter, one tablespoon at a time, mixing well.',
        'Continue kneading for 10 more minutes until butter is fully incorporated.',
        'Transfer to greased bowl, cover, and refrigerate overnight.',
        'Next day, punch down dough and shape into desired forms.',
        'Place in greased pans and let rise for 2-3 hours until doubled.',
        'Preheat oven to 375°F.',
        'Brush with egg wash.',
        'Bake for 25-30 minutes until deep golden brown.',
        'Cool on wire rack before slicing.'
      ],
      nutrition: { calories: 320, protein: 8, carbs: 35, fat: 16 },
      tips: [
        'The dough should be very soft and slightly sticky - that\'s normal.',
        'Refrigerating overnight makes the dough easier to work with.'
      ]
    },
    'chia-pudding': {
      description: 'Healthy, no-cook breakfast or snack made with chia seeds and your choice of milk. Customizable with various toppings and flavors.',
      prepTime: 5,
      cookTime: 0,
      servings: 4,
      difficulty: 'Easy',
      dietaryTags: ['Vegetarian', 'Vegan', 'Gluten-Free'],
      ingredients: [
        '1/4 cup chia seeds',
        '1 cup almond milk (or milk of choice)',
        '1 tbsp maple syrup or honey',
        '1/2 tsp vanilla extract',
        'Fresh berries for topping',
        'Sliced almonds for topping',
        'Coconut flakes for topping',
        'Optional: cocoa powder or matcha powder'
      ],
      instructions: [
        'In a bowl or jar, combine chia seeds and milk.',
        'Add maple syrup and vanilla extract.',
        'Whisk well to prevent clumping.',
        'Let sit for 5 minutes, then whisk again.',
        'Cover and refrigerate for at least 2 hours or overnight.',
        'Stir before serving to break up any clumps.',
        'Divide into serving bowls.',
        'Top with fresh berries, nuts, and other desired toppings.',
        'Serve chilled.'
      ],
      nutrition: { calories: 150, protein: 5, carbs: 18, fat: 7 },
      tips: [
        'Make several servings ahead for grab-and-go breakfasts.',
        'Adjust sweetness and thickness to your preference by varying liquid ratio.'
      ]
    }
  };
  
  const baseRecipe = mockRecipes[recipeId] || {
    description: `Delicious ${title.toLowerCase()} recipe that combines traditional techniques with modern flavors.`,
    prepTime: 20,
    cookTime: 30,
    servings: 4,
    difficulty: 'Medium',
    dietaryTags: [],
    ingredients: [
      'Main ingredient',
      'Supporting ingredients',
      'Seasonings and spices',
      'Garnishes'
    ],
    instructions: [
      'Prepare all ingredients and equipment.',
      'Follow traditional cooking methods.',
      'Season to taste and serve.'
    ],
    nutrition: { calories: 300, protein: 15, carbs: 40, fat: 10 },
    tips: [
      'Use fresh, quality ingredients for best results.',
      'Adjust seasonings to your taste preference.'
    ]
  };
  
  const recipe: Recipe = {
    id: recipeId,
    title,
    slug,
    category,
    categorySlug,
    description: baseRecipe.description!,
    image: `/images/recipes/${extractedData.filename}`,
    prepTime: baseRecipe.prepTime!,
    cookTime: baseRecipe.cookTime!,
    totalTime: baseRecipe.prepTime! + baseRecipe.cookTime!,
    servings: baseRecipe.servings!,
    difficulty: baseRecipe.difficulty as 'Easy' | 'Medium' | 'Hard',
    cuisine,
    dietaryTags: baseRecipe.dietaryTags!,
    ingredients: baseRecipe.ingredients!,
    instructions: baseRecipe.instructions!,
    nutrition: baseRecipe.nutrition!,
    tips: baseRecipe.tips!,
    datePublished: new Date().toISOString().split('T')[0],
    author: config.defaultAuthor
  };
  
  return recipe;
}

/**
 * Generate demo recipes
 */
async function generateDemoRecipes(): Promise<void> {
  console.log('🎭 Generating demo recipes (mock data for testing)...\n');
  
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
  
  console.log(`📝 Generating ${extractedData.length} demo recipes...\n`);
  
  const generatedRecipes: Recipe[] = [];
  
  for (const data of extractedData) {
    console.log(`🔄 Generating recipe for "${data.title}"...`);
    
    const recipe = generateMockRecipe(data);
    
    // Save recipe to file
    const recipeFile = path.join(recipesDir, `${recipe.id}.json`);
    fs.writeFileSync(recipeFile, JSON.stringify(recipe, null, 2));
    
    generatedRecipes.push(recipe);
    console.log(`   ✅ Generated and saved to ${path.basename(recipeFile)}`);
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Generation Summary:');
  console.log(`   ✅ Successfully generated: ${generatedRecipes.length}`);
  console.log('='.repeat(60) + '\n');
  
  // Save all recipes summary
  const recipesSummaryPath = path.join(recipesDir, '_recipes_summary.json');
  fs.writeFileSync(recipesSummaryPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    total: extractedData.length,
    successful: generatedRecipes.length,
    failed: 0,
    recipes: generatedRecipes.map(r => ({ id: r.id, title: r.title, category: r.category })),
    errors: [],
    note: 'These are demo recipes generated with mock data for testing purposes.'
  }, null, 2));
  
  console.log(`📄 Summary saved to: ${recipesSummaryPath}\n`);
  console.log('💡 To generate real recipes with AI, use: npm run ocr:parse\n');
}

// Run if called directly
if (require.main === module) {
  generateDemoRecipes().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { generateDemoRecipes };
