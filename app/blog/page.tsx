import { Metadata } from 'next';
import Link from 'next/link';
import { getAllBlogPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Blog — Cooking Tips, Nutrition & Recipes',
  description:
    'Explore the HomeChef blog for cooking tips, nutrition advice, recipe ideas, and more to help you thrive in the kitchen.',
  alternates: {
    canonical: 'https://easyhomechef.com/blog',
  },
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

const categoryLabels: Record<string, string> = {
  tips: 'Tips & Tricks',
  nutrition: 'Nutrition',
  recipes: 'Recipes',
};

const categoryColors: Record<string, string> = {
  tips: 'bg-blue-100 text-blue-700',
  nutrition: 'bg-green-100 text-green-700',
  recipes: 'bg-orange-100 text-orange-700',
};

export default function BlogPage() {
  const posts = getAllBlogPosts();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-12">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-display font-bold mb-4">Blog</h1>
            <p className="text-xl text-gray-600">
              Cooking tips, nutrition advice, and recipe ideas from the HomeChef team.
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

      {/* Blog Grid with Sidebar */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col hover:shadow-lg transition-shadow"
                >
                  <div className="p-6 flex flex-col flex-1">
                    <div className="mb-3">
                      <span
                        className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${categoryColors[post.category]}`}
                      >
                        {categoryLabels[post.category]}
                      </span>
                    </div>
                    <h2 className="text-xl font-display font-semibold mb-2 leading-snug">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="hover:text-primary-600 transition-colors"
                      >
                        {post.title}
                      </Link>
                    </h2>
                    <p className="text-gray-600 text-sm flex-1 mb-4">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-gray-400 mt-auto">
                      <span>{post.author}</span>
                      <time dateTime={post.datePublished}>{formatDate(post.datePublished)}</time>
                    </div>
                    <div className="mt-4">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                      >
                        Read more →
                      </Link>
                    </div>
                  </div>
                </article>
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
                <h3 className="font-display font-semibold text-xl mb-4">Categories</h3>
                <ul className="space-y-3">
                  {Object.entries(categoryLabels).map(([slug, label]) => (
                    <li key={slug}>
                      <span className={`inline-block text-sm font-semibold px-3 py-1 rounded-full ${categoryColors[slug]}`}>
                        {label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
