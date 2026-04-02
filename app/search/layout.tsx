import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search Recipes',
  description: 'Search through 380+ delicious recipes to find your perfect meal.',
  alternates: {
    canonical: '/search',
  },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
