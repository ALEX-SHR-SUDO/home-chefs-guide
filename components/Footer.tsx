import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white mt-16 no-print">
      {/* Ad Space - Footer Banner */}
      <div className="container-custom py-6">
        <div className="ad-space-footer">
          AdSense: Footer Banner 728x90 / Responsive
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-display font-bold mb-4 flex items-center space-x-2">
              <span className="text-2xl">🍳</span>
              <span>HomeChef</span>
            </h3>
            <p className="text-gray-400">
              Your trusted source for delicious, easy-to-follow recipes for every occasion.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-display font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/recipes/breakfast-brunch" className="text-gray-400 hover:text-white transition-colors">
                  Breakfast
                </Link>
              </li>
              <li>
                <Link href="/recipes/dinner" className="text-gray-400 hover:text-white transition-colors">
                  Dinner
                </Link>
              </li>
              <li>
                <Link href="/recipes/desserts" className="text-gray-400 hover:text-white transition-colors">
                  Desserts
                </Link>
              </li>
              <li>
                <Link href="/recipes/quick-easy" className="text-gray-400 hover:text-white transition-colors">
                  Quick & Easy
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-display font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {currentYear} HomeChef. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
