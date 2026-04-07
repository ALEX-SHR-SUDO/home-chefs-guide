import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllBlogPosts, getBlogPostBySlug } from '@/lib/blog';

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const posts = getAllBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = getBlogPostBySlug(params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `https://easyhomechef.com/blog/${post.slug}`,
    },
  };
}

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

export default function BlogPostPage({ params }: PageProps) {
  const post = getBlogPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-12">
          <div className="max-w-3xl">
            <div className="mb-4">
              <span
                className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${categoryColors[post.category]}`}
              >
                {categoryLabels[post.category]}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 leading-tight">
              {post.title}
            </h1>
            <p className="text-gray-500 text-sm">
              By {post.author} &middot;{' '}
              <time dateTime={post.datePublished}>{formatDate(post.datePublished)}</time>
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

      {/* Blog Content with Sidebar */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <article className="bg-white rounded-xl p-8 shadow-md">
              <p className="text-xl text-gray-600 mb-8 font-medium">{post.excerpt}</p>
              <div
                className="prose prose-lg max-w-none text-gray-700 space-y-4"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </article>

            <div className="mt-8">
              <Link href="/blog" className="text-primary-600 hover:text-primary-700 font-medium">
                ← Back to Blog
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="ad-space-sidebar mb-6">
                AdSense: Sidebar 300x600 / 300x250
              </div>

              {/* Back to blog */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="font-display font-semibold text-xl mb-4">Explore More</h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="/blog" className="text-primary-600 hover:text-primary-700">
                      All Blog Posts
                    </Link>
                  </li>
                  <li>
                    <Link href="/recipes/all" className="text-primary-600 hover:text-primary-700">
                      All Recipes
                    </Link>
                  </li>
                  <li>
                    <Link href="/recipes/quick-easy" className="text-primary-600 hover:text-primary-700">
                      Quick &amp; Easy Meals
                    </Link>
                  </li>
                  <li>
                    <Link href="/recipes/healthy-diet" className="text-primary-600 hover:text-primary-700">
                      Healthy Recipes
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
