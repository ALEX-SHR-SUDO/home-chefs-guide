import Link from 'next/link';
import RecipeCard from '@/components/RecipeCard';
import { getAllRecipes, categories } from '@/lib/recipes';

export default function Home() {
  const allRecipes = getAllRecipes();
  const featuredRecipes = allRecipes.slice(0, 12); // First 12 recipes as featured

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-20">
        <div className="container-custom text-center">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
            Welcome to HomeChef
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Discover 380+ delicious recipes for every meal and occasion. From quick weeknight dinners to impressive desserts.
          </p>
          <Link href="/recipes/quick-easy" className="btn-primary inline-block text-lg">
            Explore Recipes
          </Link>
        </div>
      </section>

      {/* Ad Space - After Hero */}
      <div className="container-custom my-8">
        <div className="ad-space-content">
          AdSense: Content Ad 336x280 / 300x250
        </div>
      </div>

      {/* Categories Grid */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="text-4xl font-display font-bold text-center mb-12">
            Browse by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/recipes/${category.slug}`}
                className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-primary-500 hover:shadow-lg transition-all duration-300 text-center"
              >
                <h3 className="font-display font-semibold text-lg mb-2">
                  {category.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  {category.description}
                </p>
                <span className="text-primary-600 font-medium">
                  {category.recipeCount}+ recipes
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Recipes */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-display font-bold">
              Featured Recipes
            </h2>
            <Link href="/recipes/dinner" className="text-primary-600 hover:text-primary-700 font-medium">
              View All →
            </Link>
          </div>

          {/* Sidebar Layout with Ad */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {featuredRecipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            </div>

            {/* Sidebar with Ad */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="ad-space-sidebar mb-6">
                  AdSense: Sidebar 300x600 / 300x250
                </div>
                
                {/* Quick Links */}
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <h3 className="font-display font-semibold text-xl mb-4">
                    Quick Links
                  </h3>
                  <ul className="space-y-3">
                    <li>
                      <Link href="/recipes/quick-easy" className="text-primary-600 hover:text-primary-700">
                        Quick & Easy Meals
                      </Link>
                    </li>
                    <li>
                      <Link href="/recipes/healthy-diet" className="text-primary-600 hover:text-primary-700">
                        Healthy Recipes
                      </Link>
                    </li>
                    <li>
                      <Link href="/recipes/vegetarian-vegan" className="text-primary-600 hover:text-primary-700">
                        Vegetarian & Vegan
                      </Link>
                    </li>
                    <li>
                      <Link href="/recipes/desserts" className="text-primary-600 hover:text-primary-700">
                        Desserts & Sweets
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ad Space - Before Footer */}
      <div className="container-custom my-8">
        <div className="ad-space-content">
          AdSense: Content Ad 336x280 / 300x250
        </div>
      </div>

      {/* Newsletter Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-display font-bold mb-4">
            Stay Updated
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter for new recipes, cooking tips, and exclusive content.
          </p>
          <form className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
            <button type="submit" className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
