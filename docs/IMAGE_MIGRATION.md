# Image Migration to Vercel Blob Storage

This document explains the image migration system for recipe images in the HomeChef application.

## Overview

All recipe images have been migrated from local storage (`public/images/recipes/`) to Vercel Blob Storage for:
- **Better performance**: Images are served from a CDN
- **Reduced repository size**: Images are not stored in git
- **Easier management**: Upload new images through the admin panel
- **Scalability**: No storage limits on local filesystem

## Architecture

### Storage Structure

Images are stored in Vercel Blob Storage with the following structure:
```
recipes/
  ├── naan.jpg
  ├── tiramisu.jpg
  ├── banoffee-pie.jpg
  └── ...
```

### URL Format

Images are accessible via URLs like:
```
https://[random-id].public.blob.vercel-storage.com/recipes/naan.jpg
```

## For Developers

### Prerequisites

1. Get a Vercel Blob Storage token:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard/stores)
   - Create or select a Blob store
   - Generate a Read-Write token
   
2. Add the token to `.env.local` (never commit this file!):
   ```env
   BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxx
   ```

### Uploading a New Recipe Image

#### Option 1: Using the Admin Panel (Recommended)

1. Navigate to `/admin/upload` in your browser
2. Drag and drop your image or click to select
3. Wait for the upload to complete
4. Copy the generated URL
5. Use the URL in your recipe data in `lib/recipesData.ts`

#### Option 2: Using the API Directly

See the documentation for API usage examples.

### Bulk Migration Process

If you need to migrate images from local storage to Vercel Blob:

```bash
# 1. Upload all images to Vercel Blob
npm run migrate-images

# 2. Replace old paths with new URLs in recipesData.ts
npm run replace-urls

# 3. Validate that all images are accessible
npm run validate-migration

# 4. Clean up old images (moves them to backup)
npm run clean-images

# Optional: List all images in Blob storage
npm run list-blob-images
```

For full documentation, see the complete guide in this file.
