import { NextResponse } from 'next/server';
import { getAllRecipes } from '@/lib/recipes';
import { loadRecipeOverrides, getRecipeImageUrl } from '@/lib/recipeOverrides';

export async function GET() {
  try {
    const recipes = getAllRecipes();
    
    // Load recipe image overrides from Vercel Blob
    const overrides = await loadRecipeOverrides();
    
    // Return only essential data for the admin panel, with overridden images
    const recipesData = recipes.map(recipe => ({
      id: recipe.id,
      title: recipe.title,
      slug: recipe.slug,
      category: recipe.category,
      categorySlug: recipe.categorySlug,
      image: getRecipeImageUrl(recipe.id, recipe.image, overrides),
    }));
    
    return NextResponse.json({ recipes: recipesData });
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recipes' },
      { status: 500 }
    );
  }
}
