'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import RecipeCard from '@/components/RecipeCard';
import { getAllRecipes, categories } from '@/lib/recipes';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q')?.trim() ?? '';

  const allRecipes = getAllRecipes();

  const lower = query.toLowerCase();
  const results = query
    ? allRecipes.filter((recipe) =>
        recipe.title.toLowerCase().includes(lower) ||
        recipe.description.toLowerCase().includes(lower) ||
        recipe.category.toLowerCase().includes(lower) ||
        recipe.cuisine.toLowerCase().includes(lower) ||
        recipe.dietaryTags.some((tag) => tag.toLowerCase().includes(lower))
      )
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-12">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-display font-bold mb-4">
              Search Recipes
            </h1>
            <form action="/search" method="GET" className="flex mb-4">
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Search recipes..."
                autoFocus={!query}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-lg"
              />
              <button
                type="submit"
                className="bg-primary-600 text-white px-8 py-3 rounded-r-lg hover:bg-primary-700 transition-colors text-lg font-medium"
              >
                Search
              </button>
            </form>
            {query ? (
              <p className="text-gray-500">
                {results.length}{' '}
                {results.length === 1 ? 'recipe' : 'recipes'} found for{' '}
                <span className="text-primary-600 font-medium">&ldquo;{query}&rdquo;</span>
              </p>
            ) : (
              <p className="text-xl text-gray-600">
                Enter a search term above to find recipes.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Ad Space */}
      <div className="container-custom my-8">
        <div className="ad-space-content">
          AdSense: Content Ad 336x280 / 300x250
        </div>
      </div>

      {/* Results Grid with Sidebar */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {!query && (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">
                  Use the search bar above to find recipes.
                </p>
              </div>
            )}

            {query && results.length === 0 && (
              <div className="text-center py-12">
                <h2 className="text-2xl font-display font-semibold mb-3">
                  No recipes found
                </h2>
                <p className="text-gray-600 text-lg mb-6">
                  We couldn&apos;t find any recipes matching{' '}
                  <span className="text-primary-600 font-medium">&ldquo;{query}&rdquo;</span>.
                  Try different keywords or browse a category below.
                </p>
                <Link href={`/recipes/${categories[0].slug}`} className="btn-primary inline-block">
                  Browse Recipes
                </Link>
              </div>
            )}

            {results.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {results.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="ad-space-sidebar mb-6">
                AdSense: Sidebar 300x600 / 300x250
              </div>

              {/* Browse Categories */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="font-display font-semibold text-xl mb-4">
                  Browse Categories
                </h3>
                <ul className="space-y-3">
                  {categories.slice(0, 6).map((c) => (
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

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-gray-600 text-lg">Loading search...</p></div>}>
      <SearchResults />
    </Suspense>
  );
}
