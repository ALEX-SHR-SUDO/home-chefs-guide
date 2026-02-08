# Quick Start Guide - Image Migration System

This guide will help you quickly set up and use the Vercel Blob image migration system.

## Prerequisites

- Vercel account
- Node.js 18+ installed
- Repository cloned locally

## Step 1: Get Your Vercel Blob Token

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to Storage → Create → Blob Store
3. Create a new store (or select existing)
4. Click "Generate Token"
5. Choose "Read-Write" permissions
6. Copy the token (starts with `vercel_blob_rw_`)

## Step 2: Set Up Environment

```bash
# Copy the example environment file
cp .env.example .env.local

# Edit .env.local and add your token
# BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxx
```

**Important**: Never commit `.env.local` to git! It's already in `.gitignore`.

## Step 3: Install Dependencies

```bash
npm install
```

This installs:
- `@vercel/blob` - Vercel Blob Storage SDK
- `react-dropzone` - Drag & drop uploads
- `tsx` - TypeScript execution for scripts

## Step 4: Test the Admin Panel

```bash
# Start development server
npm run dev

# Open in browser
# http://localhost:3000/admin/upload
```

Try uploading a test image to verify everything works!

## Step 5: Migrate Existing Images (Optional)

If you have existing images in `public/images/recipes/`:

```bash
# Upload all images to Vercel Blob
npm run migrate-images
# This creates scripts/image-mapping.json

# Replace old paths with new URLs
npm run replace-urls
# This updates lib/recipesData.ts

# Verify everything works
npm run validate-migration
# All checks should pass

# Clean up old images (moves to backup)
npm run clean-images
# Only run after validation passes!
```

## Step 6: Build and Deploy

```bash
# Test production build
npm run build

# Deploy to Vercel
# Make sure to set BLOB_READ_WRITE_TOKEN in Vercel dashboard
```

## Using the System

### Upload New Images

1. Go to `/admin/upload`
2. Drag & drop your image (or click to browse)
3. Wait for upload to complete
4. Click "Copy URL" button
5. Use the URL in your recipe data

### Add Image to Recipe

In `lib/recipesData.ts`:

```typescript
{
  id: "123",
  title: "My Recipe",
  image: "https://[id].public.blob.vercel-storage.com/recipes/my-image.jpg",
  // ... other fields
}
```

### View Uploaded Images

```bash
npm run list-blob-images
```

This shows all images in your Blob storage with URLs and sizes.

## Troubleshooting

### "BLOB_READ_WRITE_TOKEN is not set"
- Make sure `.env.local` exists
- Check the token is correctly pasted
- Restart your dev server after adding the token

### "Failed to upload file"
- Check file is an image (jpg, png, webp, svg)
- Check file is under 10MB
- Verify token has write permissions

### Images not loading
- Check next.config.js has correct remote patterns
- Verify URLs are correct (should contain `.public.blob.vercel-storage.com`)
- Check browser console for errors

### Build fails
- Run `npm install` to ensure all dependencies are installed
- Check for TypeScript errors: `npx tsc --noEmit`

## Admin Panel Protection (Production)

For production, add password protection:

```bash
# In .env.local (or Vercel environment)
ADMIN_PASSWORD=your_secure_password_here
```

Users will need to authenticate with:
- Username: `admin`
- Password: (your password)

## Support

- Full documentation: `docs/IMAGE_MIGRATION.md`
- Security info: `SECURITY_SUMMARY.md`
- Issues: Open a GitHub issue

## Quick Commands Reference

```bash
# Development
npm run dev                    # Start dev server
npm run build                  # Build for production

# Image management
npm run migrate-images         # Upload existing images
npm run replace-urls           # Update recipe URLs
npm run validate-migration     # Check migration
npm run clean-images           # Remove old images
npm run list-blob-images       # List uploaded images
```

---

**That's it!** You're ready to use the image migration system. Start by testing the admin panel, then migrate your existing images if needed.

For detailed information, see `docs/IMAGE_MIGRATION.md`.
