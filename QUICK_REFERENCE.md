# Vercel Blob Storage Integration - Quick Reference

## 🎯 What This Does

Transforms your recipe app from storing images locally to using Vercel Blob (cloud storage):

```
BEFORE: /images/recipes/naan.jpg (local file)
AFTER:  https://xyz.blob.vercel-storage.com/recipes/1234567890-naan.jpg (cloud URL)
```

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     User Uploads Image                       │
│                  (via /admin/upload page)                    │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  API Endpoint (/api/upload)                  │
│  • Validates file (type, size)                              │
│  • Generates unique filename                                │
│  • Uploads to Vercel Blob                                   │
│  • Returns Blob URL                                         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Vercel Blob Storage                       │
│  https://xyz.public.blob.vercel-storage.com/recipes/...     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Recipe Uses Image (via RecipeImage)             │
│  • Next.js Image optimization                               │
│  • Automatic AVIF/WebP conversion                           │
│  • Lazy loading                                             │
└─────────────────────────────────────────────────────────────┘
```

## 📋 Quick Start

### 1. Setup (5 minutes)

```bash
# Get token from Vercel Dashboard → Storage → Blob
echo "BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxx" > .env.local

# Install dependencies
npm install
```

### 2. Test Upload (1 minute)

```bash
# Start dev server
npm run dev

# Open browser
# http://localhost:3000/admin/upload

# Upload a test image
# Copy the Blob URL
```

### 3. Migrate All Images (5 minutes)

```bash
# One command to do everything:
npm run blob:migrate

# OR step by step:
npm run blob:upload        # Upload all images
npm run blob:update-urls   # Update recipe data
npm run blob:cleanup       # Delete local files
npm run blob:validate      # Verify success
```

## 📂 Key Files

```
app/
├── admin/upload/page.tsx     ← Upload UI (drag & drop)
└── api/upload/route.ts       ← Upload API endpoint

components/
└── RecipeImage.tsx           ← Optimized image component

scripts/
├── migrate-images-to-blob.ts ← Upload local → Blob
├── update-recipe-urls.ts     ← Update URLs in code
├── cleanup-local-images.ts   ← Delete local files
└── validate-blob-migration.ts ← Verify everything works

docs/
└── VERCEL_BLOB_GUIDE.md      ← Complete documentation
```

## 🔧 NPM Scripts

| Command | What It Does |
|---------|--------------|
| `npm run blob:upload` | Upload all local images to Blob |
| `npm run blob:update-urls` | Replace local paths with Blob URLs |
| `npm run blob:cleanup` | Delete local images (after migration) |
| `npm run blob:validate` | Check migration was successful |
| `npm run blob:migrate` | Do all the above in one command |

## 🎨 Using in Components

### Before (local images)
```tsx
<img src="/images/recipes/naan.jpg" alt="Naan" />
```

### After (optimized Blob images)
```tsx
import RecipeImage from '@/components/RecipeImage';

<RecipeImage
  src={recipe.image}  // Works with both local AND Blob URLs
  alt={recipe.title}
  width={800}
  height={600}
/>
```

## ✅ Benefits

| Feature | Before | After |
|---------|--------|-------|
| **Storage** | Git repo (bloated) | Vercel Blob (unlimited) |
| **Speed** | Local files | CDN (fast globally) |
| **Formats** | JPG only | Auto AVIF/WebP |
| **Optimization** | Manual | Automatic |
| **Scaling** | Limited | Unlimited |

## 🔐 Security

✅ File type validation (images only)  
✅ File size limits (5MB max)  
✅ Edge runtime for fast, secure uploads  
✅ Environment variables for tokens  
✅ CodeQL security scan passed  

## 📊 Migration Safety

The migration process is designed to be **100% safe**:

1. ✅ **Backup created** before any changes
2. ✅ **Verification checks** before deletion
3. ✅ **Migration map** logs everything
4. ✅ **Rollback possible** via backup
5. ✅ **Validation script** confirms success

## 🆘 Common Issues

### "Token not set"
```bash
# Make sure .env.local exists
echo "BLOB_READ_WRITE_TOKEN=your_token_here" > .env.local
# Restart dev server
```

### "Upload failed"
- Check file size < 5MB
- Check file type (JPG, PNG, WebP, AVIF only)
- Verify token is correct

### "Migration failed"
- Run scripts one by one to isolate issue
- Check logs for specific error
- Restore from backup if needed: `cp lib/recipesData.backup.ts lib/recipesData.ts`

## 📖 Documentation

- **Complete Guide**: `docs/VERCEL_BLOB_GUIDE.md`
- **Scripts Guide**: `scripts/README.md`
- **Implementation Details**: `IMPLEMENTATION_SUMMARY.md`

## 🚀 Production Deployment

1. Add `BLOB_READ_WRITE_TOKEN` to Vercel project environment variables
2. Push changes to GitHub
3. Vercel will auto-deploy
4. Images load from Blob automatically

## 🎉 You're Done!

The integration is complete and ready to use. Start by testing the upload at `/admin/upload`, then run the migration when ready!
