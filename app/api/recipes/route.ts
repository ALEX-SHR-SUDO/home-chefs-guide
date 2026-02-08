import { NextResponse } from 'next/server';
import { getAllRecipes } from '@/lib/recipes';

export async function GET() {
  try {
    const recipes = getAllRecipes();
    
    // Return only essential data for the admin panel
    const recipesData = recipes.map(recipe => ({
      id: recipe.id,
      title: recipe.title,
      slug: recipe.slug,
      category: recipe.category,
      categorySlug: recipe.categorySlug,
      image: recipe.image,
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
