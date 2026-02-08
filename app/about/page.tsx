import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about HomeChef and our mission to bring delicious recipes to home cooks everywhere.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-12">
          <h1 className="text-5xl font-display font-bold mb-4">
            About HomeChef
          </h1>
          <p className="text-xl text-gray-600">
            Bringing delicious recipes to home cooks everywhere
          </p>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white rounded-xl p-8 shadow-md">
              <h2 className="text-3xl font-display font-bold mb-4">Our Story</h2>
              <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
                <p>
                  Welcome to HomeChef, your trusted source for delicious, easy-to-follow recipes that bring joy to your kitchen. We believe that cooking should be accessible, enjoyable, and rewarding for everyone, regardless of skill level.
                </p>
                <p>
                  Our mission is to inspire home cooks with a diverse collection of recipes spanning multiple cuisines, dietary preferences, and cooking styles. Whether you're looking for a quick weeknight dinner, an impressive dessert for special occasions, or healthy meal options, we've got you covered.
                </p>
                <p>
                  Every recipe in our collection has been carefully crafted with clear instructions, realistic cooking times, and helpful tips to ensure your success in the kitchen. We understand that cooking is about more than just following a recipe—it's about creating memories, sharing meals with loved ones, and expressing creativity through food.
                </p>
              </div>
            </section>

            <section className="bg-white rounded-xl p-8 shadow-md">
              <h2 className="text-3xl font-display font-bold mb-4">What We Offer</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-primary-600">380+ Recipes</h3>
                  <p className="text-gray-700">
                    A comprehensive collection spanning breakfast, lunch, dinner, desserts, and more.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-primary-600">10 Categories</h3>
                  <p className="text-gray-700">
                    Organized categories to help you find exactly what you're looking for quickly.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-primary-600">Dietary Options</h3>
                  <p className="text-gray-700">
                    Vegetarian, vegan, gluten-free, and other dietary preference filters.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-primary-600">Easy Instructions</h3>
                  <p className="text-gray-700">
                    Clear, step-by-step instructions with prep times and difficulty levels.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-xl p-8 shadow-md">
              <h2 className="text-3xl font-display font-bold mb-4">Our Values</h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-2xl mr-3">✨</span>
                  <div>
                    <h3 className="font-semibold text-lg">Quality Content</h3>
                    <p className="text-gray-700">Every recipe is tested and verified to ensure great results.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">🌱</span>
                  <div>
                    <h3 className="font-semibold text-lg">Diverse Options</h3>
                    <p className="text-gray-700">Recipes for all dietary preferences and cooking skill levels.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">💚</span>
                  <div>
                    <h3 className="font-semibold text-lg">Community First</h3>
                    <p className="text-gray-700">We're here to support and inspire home cooks everywhere.</p>
                  </div>
                </li>
              </ul>
            </section>

            <section className="bg-primary-50 rounded-xl p-8 border-2 border-primary-200">
              <h2 className="text-3xl font-display font-bold mb-4">Get in Touch</h2>
              <p className="text-gray-700 mb-4">
                Have questions, suggestions, or just want to say hello? We'd love to hear from you!
              </p>
              <Link href="/contact" className="btn-primary inline-block">
                Contact Us
              </Link>
            </section>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="ad-space-sidebar mb-6">
                AdSense: Sidebar 300x600 / 300x250
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
