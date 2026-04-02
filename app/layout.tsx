import type { Metadata } from "next";
import { Inter, Poppins } from 'next/font/google';
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://easyhomechef.com'),
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
    url: 'https://easyhomechef.com',
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
  verification: {
    google: 'b4f2204c83c46dea',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        <link rel="icon" href="/favicon.svg" />
      </head>
      <body className="font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'HomeChef',
              url: 'https://easyhomechef.com',
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: 'https://easyhomechef.com/search?q={search_term_string}',
                },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}

