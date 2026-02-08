# Vercel Blob Integration Guide

## Overview

This guide explains how to use Vercel Blob storage for recipe images in the Home Chef's Guide application. Vercel Blob provides scalable, fast, and cost-effective cloud storage for your images.

## Setup

### 1. Create Blob Store

1. Log in to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to your project
3. Go to **Storage** tab
4. Click **Create Database** → **Blob**
5. Name your store (e.g., "recipe-images")
6. Click **Create**

### 2. Get Access Token

1. In your Blob store settings, find **Access Tokens**
2. Copy the `BLOB_READ_WRITE_TOKEN`
3. Store it securely - you'll need it for both local development and CI/CD

### 3. Configure Environment

Create a `.env.local` file in your project root:

```bash
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxx
```

**Important:** Never commit `.env.local` to git. It's already in `.gitignore`.

For production deployments, add the token to your Vercel project:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add `BLOB_READ_WRITE_TOKEN` with your token value
3. Select all environments (Production, Preview, Development)

## Upload New Recipe Images

### Using the Admin Panel

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to the upload page:**
   ```
   http://localhost:3000/admin/upload
   ```

3. **Upload an image:**
   - Drag and drop an image onto the upload area, OR
   - Click "Browse Files" to select an image

4. **Copy the Blob URL:**
   - After successful upload, copy the Blob URL
   - Use this URL in your recipe data

5. **Update recipe data:**
   - Add the Blob URL to your recipe's `image` field in `lib/recipesData.ts`

### Supported Image Formats

- **JPEG/JPG** (recommended for photos)
- **PNG** (for images with transparency)
- **WebP** (modern format, good compression)
- **AVIF** (newest format, best compression)

### File Size Limits

- Maximum file size: **5MB**
- Recommended: Keep images under 2MB for best performance

## Migration Process

### Automatic Migration (All Images at Once)

Run the complete migration in one command:

```bash
npm run blob:migrate
```

This will:
1. Upload all local images to Blob
2. Update recipe URLs in `recipesData.ts`
3. Delete local images
4. Validate the migration

### Manual Migration (Step by Step)

#### Step 1: Upload Images

```bash
npm run blob:upload
```

This script will:
- Read all images from `public/images/recipes/`
- Upload each image to Vercel Blob
- Generate unique filenames with timestamps
- Create a migration map at `scripts/blob-migration-map.json`
- Create a backup of `recipesData.ts`

#### Step 2: Update Recipe URLs

```bash
npm run blob:update-urls
```

This replaces all local image paths with Blob URLs in `recipesData.ts`.

#### Step 3: Clean Up Local Images

```bash
npm run blob:cleanup
```

This deletes local image files after verifying all recipes use Blob URLs.

#### Step 4: Validate Migration

```bash
npm run blob:validate
```

This checks that:
- All recipes use Blob URLs
- Blob URLs are accessible
- No broken references exist
- Local images are cleaned up

## Rollback

If you need to rollback:

```bash
# Restore from backup
cp lib/recipesData.backup.ts lib/recipesData.ts
```

## Troubleshooting

### Token Errors

**Problem:** "BLOB_READ_WRITE_TOKEN environment variable is not set"

**Solution:**
1. Ensure `.env.local` file exists in project root
2. Verify the token is correct
3. Restart your development server

### Upload Failures

**Problem:** "Failed to upload file"

**Causes:**
- File size exceeds 5MB → Compress image
- Invalid file format → Use JPEG, PNG, WebP, or AVIF
- Network issues → Check internet connection
- Invalid token → Verify token in Vercel Dashboard

## Image Optimization

The application automatically optimizes images using the `RecipeImage` component:

```tsx
import RecipeImage from '@/components/RecipeImage';

<RecipeImage
  src={recipe.image}
  alt={recipe.title}
  width={800}
  height={600}
  priority={false}
  className="rounded-lg"
/>
```

**Benefits:**
- Automatic format conversion (AVIF/WebP)
- Responsive sizing
- Lazy loading
- Better Core Web Vitals scores

## Best Practices

### For New Recipe Images

1. ✅ Use the admin panel to upload
2. ✅ Copy the Blob URL immediately
3. ✅ Test the URL before using
4. ✅ Use descriptive filenames

### For Migration

1. ✅ Always create backups
2. ✅ Run validation after migration
3. ✅ Test locally before deploying
4. ✅ Keep migration map for audit

## Support

- **Vercel Docs:** https://vercel.com/docs/storage/vercel-blob
- **Repository Issues:** https://github.com/ALEX-SHR-SUDO/home-chefs-guide/issues
