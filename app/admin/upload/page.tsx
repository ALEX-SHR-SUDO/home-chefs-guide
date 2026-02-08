'use client';

import { useState } from 'react';
import ImageUploader from '@/components/ImageUploader';

export default function AdminUploadPage() {
  const [recentUploads, setRecentUploads] = useState<Array<{ url: string; timestamp: string; copied?: boolean }>>([]);

  const handleUploadSuccess = (url: string) => {
    const newUpload = {
      url,
      timestamp: new Date().toLocaleString(),
      copied: false,
    };
    setRecentUploads([newUpload, ...recentUploads.slice(0, 9)]); // Keep last 10
  };

  const handleCopy = async (index: number, url: string) => {
    await navigator.clipboard.writeText(url);
    const updated = [...recentUploads];
    updated[index].copied = true;
    setRecentUploads(updated);
    setTimeout(() => {
      const reset = [...recentUploads];
      reset[index].copied = false;
      setRecentUploads(reset);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Recipe Image Upload
          </h1>
          <p className="text-gray-600">
            Upload images to Vercel Blob Storage for use in recipes
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Upload Image</h2>
          <ImageUploader onUploadSuccess={handleUploadSuccess} />
        </div>

        {/* Recent Uploads */}
        {recentUploads.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Uploads</h2>
            <div className="space-y-3">
              {recentUploads.map((upload, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <img
                      src={upload.url}
                      alt="Uploaded"
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-500 mb-1">{upload.timestamp}</p>
                      <p className="text-sm text-gray-700 truncate font-mono">
                        {upload.url}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy(index, upload.url)}
                    className="ml-4 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex-shrink-0 flex items-center gap-1"
                  >
                    {upload.copied ? (
                      <>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Copied
                      </>
                    ) : (
                      'Copy'
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            How to use uploaded images
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-800">
            <li>Upload an image using the drag & drop area above</li>
            <li>Copy the generated URL</li>
            <li>Use the URL in your recipe data in <code className="bg-white px-2 py-1 rounded">lib/recipesData.ts</code></li>
            <li>The image will be automatically optimized by Next.js Image component</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
