import { Metadata } from 'next';
import Link from 'next/link';
import RecipeCard from '@/components/RecipeCard';
import { getAllRecipes, categories } from '@/lib/recipes';

export const metadata: Metadata = {
  title: 'All Recipes',
  description: 'Browse all 380+ recipes across every category — from breakfast and dinner to desserts, baking, and international cuisine.',
  alternates: {
    canonical: 'https://easyhomechef.com/recipes/all',
  },
  openGraph: {
    title: 'All Recipes | HomeChef',
    description: 'Browse all 380+ recipes across every category — from breakfast and dinner to desserts, baking, and international cuisine.',
  },
};

export default function AllRecipesPage() {
  const recipes = getAllRecipes();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-12">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-display font-bold mb-4">
              All Recipes
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Explore our complete collection of delicious recipes for every meal and occasion.
            </p>
            <p className="text-gray-500">
              Showing {recipes.length} recipes
            </p>
          </div>
        </div>
      </div>

      {/* Ad Space */}
      <div className="container-custom my-8">
        <div className="ad-space-content">
          AdSense: Content Ad 336x280 / 300x250
        </div>
      </div>

      {/* Recipes Grid with Sidebar */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="ad-space-sidebar mb-6">
                AdSense: Sidebar 300x600 / 300x250
              </div>

              {/* Categories */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="font-display font-semibold text-xl mb-4">
                  Browse by Category
                </h3>
                <ul className="space-y-3">
                  {categories.map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={`/recipes/${c.slug}`}
                        className="text-primary-600 hover:text-primary-700 flex justify-between items-center"
                      >
                        <span>{c.name}</span>
                        <span className="text-sm text-gray-500">{c.recipeCount}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ad Space - Before Footer */}
      <div className="container-custom mb-8">
        <div className="ad-space-content">
          AdSense: Content Ad 336x280 / 300x250
        </div>
      </div>
    </div>
  );
}
