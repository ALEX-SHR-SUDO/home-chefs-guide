'use client';

import { useState, useEffect, useRef } from 'react';

interface Recipe {
  id: string;
  title: string;
  slug: string;
  category: string;
  categorySlug: string;
  image: string;
}

export default function ReplacePhotosPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [preview, setPreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await fetch('/api/recipes');
      const data = await response.json();
      setRecipes(data.recipes);
    } catch (err) {
      setError('Failed to load recipes');
    } finally {
      setLoading(false);
    }
  };

  const filteredRecipes = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    } catch (err: any) {
      setError(err.message || 'Failed to upload file');
      setPreview('');
    } finally {
      setUploading(false);
    }
  };

  const handleReplacePhoto = async () => {
    if (!selectedRecipe || !uploadedUrl) {
      setError('Please select a recipe and upload a new photo');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/recipes/update-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipeId: selectedRecipe.id,
          newImageUrl: uploadedUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update recipe photo');
      }

      setSuccess(`Photo successfully replaced for "${selectedRecipe.title}"!`);
      
      // Update local state
      setRecipes(recipes.map(r => 
        r.id === selectedRecipe.id 
          ? { ...r, image: uploadedUrl }
          : r
      ));
      
      // Reset form
      setSelectedRecipe(null);
      setUploadedUrl('');
      setPreview('');
    } catch (err: any) {
      setError(err.message || 'Failed to replace photo');
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setSelectedRecipe(null);
    setUploadedUrl('');
    setPreview('');
    setError('');
    setSuccess('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Replace Recipe Photos
          </h1>
          <p className="text-gray-600">
            Select a recipe and upload a new photo to replace the old one
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex">
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
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
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
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Recipe Selection */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Select Recipe
            </h2>

            {/* Search */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Recipe List */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredRecipes.map((recipe) => (
                <div
                  key={recipe.id}
                  onClick={() => {
                    setSelectedRecipe(recipe);
                    setError('');
                    setSuccess('');
                  }}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedRecipe?.id === recipe.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-16 h-16 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.src = '/images/placeholder.jpg';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {recipe.title}
                      </p>
                      <p className="text-xs text-gray-500">{recipe.category}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredRecipes.length === 0 && (
              <p className="text-center text-gray-500 py-8">No recipes found</p>
            )}
          </div>

          {/* Right Column: Photo Upload */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Upload New Photo
            </h2>

            {selectedRecipe ? (
              <div className="space-y-4">
                {/* Current Photo */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Selected Recipe: {selectedRecipe.title}
                  </p>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-2">Current Photo:</p>
                    <img
                      src={selectedRecipe.image}
                      alt={selectedRecipe.title}
                      className="w-full h-48 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.src = '/images/placeholder.jpg';
                      }}
                    />
                  </div>
                </div>

                {/* New Photo Upload */}
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/avif"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  {!preview ? (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                    >
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="mt-2 text-sm text-gray-600">
                        Click to upload new photo
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        JPG, PNG, WebP, AVIF (max 5MB)
                      </p>
                    </button>
                  ) : (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <p className="text-xs text-gray-500 mb-2">New Photo:</p>
                      <img
                        src={preview}
                        alt="New photo preview"
                        className="w-full h-48 object-cover rounded mb-3"
                      />
                      {!uploading && uploadedUrl && (
                        <button
                          onClick={() => {
                            setPreview('');
                            setUploadedUrl('');
                            fileInputRef.current!.value = '';
                          }}
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          Upload Different Photo
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Upload Progress */}
                {uploading && !uploadedUrl && (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-700">Uploading...</span>
                  </div>
                )}

                {/* Action Buttons */}
                {uploadedUrl && (
                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={handleReplacePhoto}
                      disabled={uploading}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Replace Photo
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={uploading}
                      className="flex-1 px-4 py-2 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="mt-2 text-sm text-gray-500">
                    Select a recipe to replace its photo
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
