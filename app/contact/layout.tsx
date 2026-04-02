import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: "We'd love to hear from you! Send us a message.",
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
