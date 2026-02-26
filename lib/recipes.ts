import { Recipe } from './types';
import { allRecipes } from './recipesData';

// Recipe generation utilities
export function generateRecipeId(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function generateRecipeSlug(title: string): string {
  return generateRecipeId(title);
}

// All recipes from data file
export const sampleRecipes: Recipe[] = allRecipes;

// Categories configuration
export const categories = [
  {
    name: 'Breakfast & Brunch',
    slug: 'breakfast-brunch',
    description: 'Start your day right with delicious breakfast and brunch recipes.',
    recipeCount: 40,
  },
  {
    name: 'Lunch Ideas',
    slug: 'lunch',
    description: 'Quick and satisfying lunch recipes for busy days.',
    recipeCount: 35,
  },
  {
    name: 'Dinner Recipes',
    slug: 'dinner',
    description: 'Hearty dinner recipes perfect for family meals.',
    recipeCount: 60,
  },
  {
    name: 'Appetizers & Snacks',
    slug: 'appetizers-snacks',
    description: 'Delicious appetizers and snacks for any occasion.',
    recipeCount: 30,
  },
  {
    name: 'Desserts & Sweets',
    slug: 'desserts',
    description: 'Sweet treats and desserts to satisfy your cravings.',
    recipeCount: 50,
  },
  {
    name: 'Baking & Breads',
    slug: 'baking-breads',
    description: 'Freshly baked breads, pastries, and more.',
    recipeCount: 25,
  },
  {
    name: 'Vegetarian & Vegan',
    slug: 'vegetarian-vegan',
    description: 'Plant-based recipes that are both healthy and delicious.',
    recipeCount: 30,
  },
  {
    name: 'Quick & Easy',
    slug: 'quick-easy',
    description: '30-minute meals for when you\'re short on time.',
    recipeCount: 40,
  },
  {
    name: 'Healthy & Diet',
    slug: 'healthy-diet',
    description: 'Nutritious recipes for a healthy lifestyle.',
    recipeCount: 30,
  },
  {
    name: 'International Cuisine',
    slug: 'international',
    description: 'Explore flavors from around the world.',
    recipeCount: 40,
  },
];

export function getRecipesByCategory(categorySlug: string): Recipe[] {
  return sampleRecipes.filter(recipe => recipe.categorySlug === categorySlug);
}

export function getRecipe(categorySlug: string, recipeSlug: string): Recipe | undefined {
  return sampleRecipes.find(
    recipe => recipe.categorySlug === categorySlug && recipe.slug === recipeSlug
  );
}

export function getAllRecipes(): Recipe[] {
  return sampleRecipes;
}
