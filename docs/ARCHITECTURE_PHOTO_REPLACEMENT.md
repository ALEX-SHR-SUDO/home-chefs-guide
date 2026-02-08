# Photo Replacement System - Architecture Comparison

## ❌ OLD APPROACH (Broken in Serverless)

```
User visits /admin/replace-photos
    ↓
Selects recipe & uploads new image
    ↓
Image uploaded to Vercel Blob ✓
    ↓
POST /api/recipes/update-image
    ↓
Try to write to lib/recipesData.ts
    ↓
❌ ERROR: EROFS: read-only file system
```

**Problem**: Serverless environments (Vercel, AWS Lambda) have read-only filesystems except for `/tmp`. Cannot modify source code files at runtime.

## ✅ NEW APPROACH (Works Everywhere)

```
User visits /admin/replace-photos
    ↓
Selects recipe & uploads new image
    ↓
Image uploaded to Vercel Blob ✓
    ↓
POST /api/recipes/update-image
    ↓
Load existing overrides from Blob
    ↓
Add/Update recipe override
    ↓
Save overrides back to Blob ✓
    ↓
✅ SUCCESS: Override saved
```

**Solution**: Store overrides separately in Vercel Blob (writable storage), keep original data in git.

## Data Flow

### Reading Recipe Data

```
GET /api/recipes
    ↓
Load base recipes from recipesData.ts (read-only)
    ↓
Load overrides from Vercel Blob (recipe-overrides.json)
    ↓
For each recipe:
  - Check if override exists
  - Use override image URL if present
  - Otherwise use original image URL
    ↓
Return merged recipe data
```

### Writing Recipe Data

```
POST /api/recipes/update-image
{recipeId: "1", newImageUrl: "https://..."}
    ↓
Load current overrides from Blob
    ↓
overrides["1"] = {
  recipeId: "1",
  imageUrl: "https://...",
  updatedAt: "2024-01-15T10:30:00Z"
}
    ↓
Convert to JSON
    ↓
Upload to Vercel Blob (overwrites previous)
    ↓
Done ✓
```

## Storage Structure

### Original Data (Git - Immutable)
```
lib/recipesData.ts
├── Recipe 1 → image: "/images/recipes/pancakes.jpg"
├── Recipe 2 → image: "/images/recipes/waffles.jpg"
└── Recipe 3 → image: "/images/recipes/omelette.jpg"
```

### Override Data (Vercel Blob - Mutable)
```json
recipe-overrides.json (in Vercel Blob)
{
  "1": {
    "recipeId": "1",
    "imageUrl": "https://blob.../new-pancakes.jpg",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Effective Result (At Runtime)
```
Recipe 1 → https://blob.../new-pancakes.jpg  (overridden ✓)
Recipe 2 → /images/recipes/waffles.jpg      (original)
Recipe 3 → /images/recipes/omelette.jpg     (original)
```

## Benefits

### ✅ Serverless Compatible
- No filesystem writes needed
- Works on Vercel, AWS Lambda, etc.
- Uses proper cloud storage

### ✅ Clean Git History
- No binary image files in commits
- No code changes for content updates
- Original data preserved

### ✅ Fast Updates
- Admin panel shows changes immediately
- No rebuild/redeploy needed for admin view
- Overrides load in milliseconds

### ✅ Safe Rollback
- Original data untouched in git
- Can delete override file to revert all changes
- Individual overrides can be removed

### ✅ Scalable
- Blob storage handles unlimited images
- Single JSON file for all overrides
- No performance impact on static pages

## Environment Requirements

### Required
```bash
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxx
```

Get from: Vercel Dashboard → Storage → Blob → Copy Token

### Local Development
Create `.env.local`:
```bash
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxx
```

### Production
Add in Vercel Dashboard:
- Go to Project Settings → Environment Variables
- Add `BLOB_READ_WRITE_TOKEN`
- Select all environments
- Deploy/Redeploy

## API Reference

### Get All Recipes (with overrides)
```
GET /api/recipes

Response:
{
  "recipes": [
    {
      "id": "1",
      "title": "Fluffy Pancakes",
      "image": "https://blob.../new-image.jpg"  // overridden
    }
  ]
}
```

### Update Recipe Image
```
POST /api/recipes/update-image
Content-Type: application/json

{
  "recipeId": "1",
  "newImageUrl": "https://blob.../new-image.jpg"
}

Success Response:
{
  "success": true,
  "message": "Recipe image updated successfully"
}

Error Response:
{
  "error": "BLOB_READ_WRITE_TOKEN is not configured. Please set it in your environment variables."
}
```

## File Structure

```
home-chefs-guide/
├── lib/
│   ├── recipesData.ts           # Base recipe data (read-only)
│   ├── recipeOverrides.ts       # Override management (new)
│   └── recipes.ts               # Recipe utilities (updated)
├── app/api/
│   └── recipes/
│       ├── route.ts             # GET recipes (updated)
│       └── update-image/
│           └── route.ts         # POST update (rewritten)
├── docs/
│   └── PHOTO_REPLACEMENT.md     # Detailed guide (new)
└── SECURITY_SUMMARY_PHOTO_REPLACEMENT.md  # Security analysis (new)
```

## Migration Path

No migration needed! The system gracefully handles:
- ✅ Missing override file → Returns empty object
- ✅ Empty override file → Returns empty object
- ✅ Malformed override file → Returns empty object, logs error
- ✅ Missing BLOB token → Returns empty object in read, error in write

Start using immediately after:
1. Setting `BLOB_READ_WRITE_TOKEN`
2. Deploying the code
3. Visiting `/admin/replace-photos`

## Limitations

### Static Pages
The main recipe pages are statically generated at build time. They will show original images until redeployment.

**Workaround**: Admin panel shows updated images immediately. Trigger a redeployment to rebuild static pages with new images.

**Future Enhancement**: Could implement ISR (Incremental Static Regeneration) to auto-rebuild changed pages.

### Authentication
Admin panel is not protected by default. Add authentication middleware before production use.

**Example** in `middleware.ts`:
```typescript
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Check authentication
    // Redirect if not authorized
  }
}
```
