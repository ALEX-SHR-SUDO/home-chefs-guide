import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL('https://homechef-recipes.com'),
  title: {
    default: 'HomeChef - Delicious Recipes for Every Occasion',
    template: '%s | HomeChef'
  },
  description: 'Discover 380+ delicious recipes including breakfast, lunch, dinner, desserts, and more. Easy-to-follow instructions with prep time, cook time, and nutrition info.',
  keywords: ['recipes', 'cooking', 'food', 'homechef', 'dinner recipes', 'desserts', 'healthy recipes', 'quick meals'],
  authors: [{ name: 'HomeChef Team' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://homechef-recipes.com',
    siteName: 'HomeChef',
    title: 'HomeChef - Delicious Recipes for Every Occasion',
    description: 'Discover 380+ delicious recipes for every meal and occasion.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'HomeChef Recipe Collection',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HomeChef - Delicious Recipes',
    description: 'Discover 380+ delicious recipes for every meal and occasion.',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans">
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

