'use client';

import Link from 'next/link';
import { useState } from 'react';

const categories = [
  { name: 'Breakfast & Brunch', slug: 'breakfast-brunch' },
  { name: 'Lunch Ideas', slug: 'lunch' },
  { name: 'Dinner Recipes', slug: 'dinner' },
  { name: 'Appetizers & Snacks', slug: 'appetizers-snacks' },
  { name: 'Desserts & Sweets', slug: 'desserts' },
  { name: 'Baking & Breads', slug: 'baking-breads' },
  { name: 'Vegetarian & Vegan', slug: 'vegetarian-vegan' },
  { name: 'Quick & Easy', slug: 'quick-easy' },
  { name: 'Healthy & Diet', slug: 'healthy-diet' },
  { name: 'International Cuisine', slug: 'international' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 no-print">
      {/* Ad Space - Header Banner */}
      <div className="ad-space-header container-custom">
        AdSense: Header Banner 728x90 / 320x50 (Mobile)
      </div>
      
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-3xl">🍳</div>
            <span className="text-2xl font-display font-bold text-primary-600">
              HomeChef
            </span>
          </Link>

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              type="submit"
              className="bg-primary-600 text-white px-6 py-2 rounded-r-lg hover:bg-primary-700 transition-colors"
            >
              Search
            </button>
          </form>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="md:hidden mt-4 flex">
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button
            type="submit"
            className="bg-primary-600 text-white px-6 py-2 rounded-r-lg hover:bg-primary-700 transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Navigation */}
      <nav className="bg-gray-50 border-t border-gray-200">
        <div className="container-custom">
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-1 py-3 overflow-x-auto">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/recipes/${category.slug}`}
                className="px-4 py-2 rounded-lg hover:bg-primary-100 hover:text-primary-700 whitespace-nowrap transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-3 space-y-2">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/recipes/${category.slug}`}
                  className="block px-4 py-2 rounded-lg hover:bg-primary-100 hover:text-primary-700 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
