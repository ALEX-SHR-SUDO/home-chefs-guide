# Recipe Images Status

## Current State

**No recipe photo files (.jpg, .png, .jpeg, .webp) are stored in this git repository.**

### What We Have

- **380+ SVG placeholder images** located in `public/images/recipes/`
- Total size: ~1.6MB (very efficient)
- Each SVG file is approximately 1.2KB
- SVG format chosen for:
  - Scalability without quality loss
  - Small file size
  - Fast git operations
  - Placeholder purposes

### Photo Storage Strategy

This repository uses a **hybrid approach** for recipe images:

1. **Git Repository (Current)**
   - SVG placeholder images only
   - Used as default/fallback images
   - Stored in `public/images/recipes/`
   
2. **Vercel Blob Storage (For Uploads)**
   - Real recipe photos uploaded via admin panel
   - Stored externally in Vercel Blob
   - Not tracked in git
   - Referenced via override system

### Why Photos Are NOT in Git

**Benefits of keeping photos out of git:**
- ✅ Keeps repository size small
- ✅ Fast git operations (clone, pull, push)
- ✅ No binary files in version control
- ✅ Easier to manage and update images
- ✅ Works with serverless/read-only filesystems
- ✅ Unlimited storage via Vercel Blob
- ✅ No merge conflicts with image files

### How Photo Replacement Works

When you want to replace a recipe image with a real photo:

1. Use the admin panel at `/admin/replace-photos`
2. Upload your photo (JPG, PNG, WebP)
3. Photo is stored in Vercel Blob
4. Override is created linking recipe to new photo URL
5. New photo displays immediately in admin panel
6. Static pages show new photo after redeployment

See [Photo Replacement Guide](docs/PHOTO_REPLACEMENT.md) for details.

## Verification

Run this command to verify no photo files exist:

```bash
find . -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.webp" \) ! -path "*/node_modules/*" ! -path "*/.git/*"
```

Expected result: **No files found**

## Summary

✅ **No recipe photos in git** - Only SVG placeholders  
✅ **Photo uploads** - Via Vercel Blob Storage  
✅ **Efficient storage** - 1.6MB for 380+ SVG images  
✅ **Flexible system** - Easy to add real photos without git commits
