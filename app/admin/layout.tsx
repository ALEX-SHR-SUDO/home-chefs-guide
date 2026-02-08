import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {/* Admin Navigation */}
      <nav className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold">
                Home Chef's Guide
              </Link>
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  href="/admin/upload"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                >
                  Upload Images
                </Link>
                <Link
                  href="/admin/replace-photos"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                >
                  Replace Photos
                </Link>
                <Link
                  href="/admin/migrate"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                >
                  Migrate to Blob
                </Link>
              </div>
            </div>
            <div className="text-sm text-gray-300">Admin Panel</div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
}
