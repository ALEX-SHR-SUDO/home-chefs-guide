export interface Recipe {
  id: string;
  title: string;
  slug: string;
  category: string;
  categorySlug: string;
  description: string;
  image: string;
  prepTime: number; // minutes
  cookTime: number; // minutes
  totalTime: number; // minutes
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  cuisine: string;
  dietaryTags: string[];
  ingredients: string[];
  instructions: string[];
  nutrition: {
    calories: number;
    protein: number; // grams
    carbs: number; // grams
    fat: number; // grams
  };
  tips: string[];
  datePublished: string;
  author: string;
}

export interface Category {
  name: string;
  slug: string;
  description: string;
  recipeCount: number;
}
