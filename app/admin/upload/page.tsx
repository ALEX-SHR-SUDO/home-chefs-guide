'use client';

import { useState, useRef } from 'react';

export default function UploadPage() {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [preview, setPreview] = useState<string>('');
  const [uploadInfo, setUploadInfo] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    setError('');
    setUploadedUrl('');
    setUploadInfo(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setUploadedUrl(data.url);
      setUploadInfo(data);
    } catch (err: any) {
      setError(err.message || 'Failed to upload file');
      setPreview('');
    } finally {
      setUploading(false);
    }
  };

  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(uploadedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Recipe Image Upload
          </h1>
          <p className="text-gray-600">
            Upload recipe images to Vercel Blob Storage
          </p>
        </div>

        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-12 text-center ${
            dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/avif"
            onChange={handleChange}
            className="hidden"
          />

          {!preview && (
            <div>
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="mt-2 text-sm text-gray-600">
                Drag and drop an image here, or
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Browse Files
              </button>
              <p className="mt-4 text-xs text-gray-500">
                Supported: JPG, PNG, WebP, AVIF (max 5MB)
              </p>
            </div>
          )}

          {preview && (
            <div className="space-y-4">
              <img
                src={preview}
                alt="Preview"
                className="mx-auto max-h-64 rounded-lg"
              />
              {!uploading && (
                <button
                  onClick={() => {
                    setPreview('');
                    setUploadedUrl('');
                    setError('');
                    setUploadInfo(null);
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Upload Another
                </button>
              )}
            </div>
          )}
        </div>

        {/* Upload Progress */}
        {uploading && (
          <div className="mt-6 bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-700">Uploading...</span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Upload Error
                </h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {uploadedUrl && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <svg
                className="h-5 w-5 text-green-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <h3 className="ml-2 text-lg font-medium text-green-800">
                Upload Successful!
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Blob URL:
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    readOnly
                    value={uploadedUrl}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-white text-sm font-mono"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {copied ? '✓ Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              {uploadInfo && (
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    <strong>Filename:</strong> {uploadInfo.filename}
                  </p>
                  <p>
                    <strong>Size:</strong>{' '}
                    {(uploadInfo.size / 1024).toFixed(2)} KB
                  </p>
                  <p>
                    <strong>Type:</strong> {uploadInfo.type}
                  </p>
                  <p>
                    <strong>Uploaded:</strong>{' '}
                    {new Date(uploadInfo.uploadedAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
