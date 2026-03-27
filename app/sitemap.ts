import { MetadataRoute } from 'next';
import { getAllRecipes, categories } from '@/lib/recipes';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://home-chefs-guide.vercel.app';
  const sitePublishedDate = new Date('2024-01-15');

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: sitePublishedDate,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: sitePublishedDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: sitePublishedDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: sitePublishedDate,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: sitePublishedDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: sitePublishedDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Category pages
  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${baseUrl}/recipes/${category.slug}`,
    lastModified: sitePublishedDate,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Recipe pages
  const allRecipes = getAllRecipes();
  const recipePages: MetadataRoute.Sitemap = allRecipes.map((recipe) => ({
    url: `${baseUrl}/recipes/${recipe.categorySlug}/${recipe.slug}`,
    lastModified: new Date(recipe.datePublished),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...recipePages];
}
