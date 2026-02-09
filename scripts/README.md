# Migration Scripts

> **Note:** This repository currently uses SVG placeholders, not actual photo files. These scripts are designed for hypothetical scenarios where you would migrate local photo files to Vercel Blob storage.

This directory contains scripts for migrating recipe images to Vercel Blob storage.

## Scripts Overview

### 1. migrate-images-to-blob.ts
**Purpose:** Upload all local recipe images to Vercel Blob storage

**Usage:**
```bash
npm run blob:upload
```

**What it does:**
- Reads all images from `public/images/recipes/`
- Uploads each image to Vercel Blob
- Generates unique filenames with timestamps
- Creates migration map at `scripts/blob-migration-map.json`
- Creates backup of `recipesData.ts`

**Requirements:**
- `BLOB_READ_WRITE_TOKEN` environment variable must be set

### 2. update-recipe-urls.ts
**Purpose:** Update recipe data to use Blob URLs instead of local paths

**Usage:**
```bash
npm run blob:update-urls
```

**What it does:**
- Reads migration map from `scripts/blob-migration-map.json`
- Finds and replaces local image paths with Blob URLs in `lib/recipesData.ts`
- Validates that no local paths remain

**Requirements:**
- Must run `blob:upload` first

### 3. cleanup-local-images.ts
**Purpose:** Delete local image files after successful migration

**Usage:**
```bash
npm run blob:cleanup
```

**What it does:**
- Verifies all recipes use Blob URLs
- Confirms all images were migrated successfully
- Deletes local image files from `public/images/recipes/`
- Updates `.gitignore` to prevent future local image commits

**Safety checks:**
- Won't delete if any recipes still use local paths
- Won't delete if migration map is missing

### 4. validate-blob-migration.ts
**Purpose:** Validate that migration was successful

**Usage:**
```bash
npm run blob:validate
```

**What it does:**
- Checks all recipes use Blob URLs (not local paths)
- Tests accessibility of Blob URLs (sample check)
- Verifies no broken image references
- Confirms local images directory is clean
- Matches migration map with `recipesData.ts`

**Exit codes:**
- `0` - All checks passed
- `1` - Validation failed

## Complete Migration Workflow

### Option 1: All-in-One Migration
```bash
npm run blob:migrate
```

This runs all scripts in sequence:
1. Upload images
2. Update URLs
3. Cleanup local files

### Option 2: Step-by-Step Migration
```bash
# Step 1: Upload images to Blob
npm run blob:upload

# Step 2: Update recipe URLs
npm run blob:update-urls

# Step 3: Clean up local images
npm run blob:cleanup

# Step 4: Validate migration
npm run blob:validate
```

## Files Generated

### blob-migration-map.json
Contains mapping of old paths to new Blob URLs:
```json
[
  {
    "oldPath": "/images/recipes/naan.jpg",
    "localFile": "public/images/recipes/naan.jpg",
    "blobUrl": "https://xyz.public.blob.vercel-storage.com/recipes/1234567890-naan.jpg",
    "uploadedAt": "2026-02-08T12:00:00Z",
    "fileSize": 45678
  }
]
```

This file is:
- Created by `migrate-images-to-blob.ts`
- Used by `update-recipe-urls.ts` and `cleanup-local-images.ts`
- Should be committed to git for audit trail

## Prerequisites

1. **Vercel Blob Token:**
   - Get token from Vercel Dashboard → Storage → Blob
   - Add to `.env.local`:
     ```
     BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxx
     ```

2. **Dependencies:**
   ```bash
   npm install
   ```

## Troubleshooting

### "BLOB_READ_WRITE_TOKEN environment variable is not set"
- Ensure `.env.local` exists in project root
- Verify token is correct
- Restart development server after adding token

### "Migration map not found"
- Run `npm run blob:upload` first

### "Some recipes still use local image paths"
- Check which recipes haven't been updated
- Manually verify `lib/recipesData.ts`
- Re-run `npm run blob:update-urls`

## Rollback

To rollback the migration:
```bash
# Restore from backup
cp lib/recipesData.backup.ts lib/recipesData.ts
```

## Best Practices

1. ✅ Always run validation after migration
2. ✅ Keep migration map for audit trail
3. ✅ Test locally before deploying
4. ✅ Create backups before running scripts
5. ✅ Review changes before committing
