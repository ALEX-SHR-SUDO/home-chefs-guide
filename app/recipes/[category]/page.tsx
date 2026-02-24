import { Metadata } from 'next';
import Link from 'next/link';
import RecipeCard from '@/components/RecipeCard';
import { getRecipesByCategoryWithOverrides, categories } from '@/lib/recipes';

interface PageProps {
  params: Promise<{
    category: string;
  }>;
}

export async function generateStaticParams() {
  return categories.map((category) => ({
    category: category.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = categories.find(c => c.slug === categorySlug);
  
  if (!category) {
    return {
      title: 'Category Not Found',
    };
  }

  return {
    title: category.name,
    description: category.description,
    openGraph: {
      title: `${category.name} | HomeChef`,
      description: category.description,
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category: categorySlug } = await params;
  const category = categories.find(c => c.slug === categorySlug);
  const recipes = await getRecipesByCategoryWithOverrides(categorySlug);

  if (!category) {
    return (
      <div className="container-custom py-16 text-center">
        <h1 className="text-4xl font-display font-bold mb-4">Category Not Found</h1>
        <Link href="/" className="text-primary-600 hover:text-primary-700">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-12">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-display font-bold mb-4">
              {category.name}
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              {category.description}
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

            {recipes.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">
                  No recipes found in this category yet.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="ad-space-sidebar mb-6">
                AdSense: Sidebar 300x600 / 300x250
              </div>

              {/* Other Categories */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="font-display font-semibold text-xl mb-4">
                  Other Categories
                </h3>
                <ul className="space-y-3">
                  {categories
                    .filter(c => c.slug !== categorySlug)
                    .slice(0, 6)
                    .map((c) => (
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
