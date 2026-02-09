# Recipe Photo Replacement System

> **Current Status:** This repository uses SVG placeholder images for all recipes. No actual photo files (.jpg, .png, .webp) are stored in git. See [RECIPE_IMAGES_STATUS.md](../RECIPE_IMAGES_STATUS.md) for details.

## Overview

The recipe photo replacement system allows you to update recipe images dynamically without modifying the source code or redeploying the application. This is designed to work in serverless environments like Vercel where the filesystem is read-only.

## How It Works

### Architecture

1. **Base Recipe Data**: Stored in `lib/recipesData.ts` (read-only in production)
2. **Image Overrides**: Stored in Vercel Blob as a JSON file (`recipe-overrides.json`)
3. **Merge Layer**: API endpoints merge base data with overrides at runtime

When you replace a recipe photo:
- The new image is uploaded to Vercel Blob
- An override entry is created linking the recipe ID to the new image URL
- The override is saved to `recipe-overrides.json` in Vercel Blob
- The admin panel and API endpoints automatically use the new image

### File Structure

```
lib/
  ├── recipesData.ts          # Base recipe data (380+ recipes)
  ├── recipeOverrides.ts      # Override management module
  └── recipes.ts              # Recipe utilities

app/api/
  ├── recipes/route.ts        # Returns recipes with overrides applied
  └── recipes/update-image/   # Endpoint to update recipe images
      └── route.ts
```

## Usage

### Admin Panel

1. Navigate to `/admin/replace-photos`
2. Search for the recipe you want to update
3. Click on the recipe to select it
4. Upload a new image (drag & drop or click to browse)
5. Click "Replace Photo" to save the change

### API Endpoints

**Get All Recipes** (with overrides applied)
```
GET /api/recipes
```

**Update Recipe Image**
```
POST /api/recipes/update-image
Body: {
  "recipeId": "1",
  "newImageUrl": "https://blob-url/image.jpg"
}
```

## Environment Setup

### Required Environment Variable

```bash
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxx
```

Get this token from:
1. Vercel Dashboard → Your Project → Storage
2. Create a Blob store (if you haven't already)
3. Copy the `BLOB_READ_WRITE_TOKEN`

### Local Development

Create a `.env.local` file:
```bash
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxx
```

### Production

Add the environment variable in Vercel Dashboard:
1. Go to Project Settings → Environment Variables
2. Add `BLOB_READ_WRITE_TOKEN` with your token
3. Select all environments (Production, Preview, Development)
4. Deploy or redeploy your application

## Technical Details

### Override Storage Format

The `recipe-overrides.json` file stored in Vercel Blob has this structure:

```json
{
  "1": {
    "recipeId": "1",
    "imageUrl": "https://blob-url/recipes/1234567890-pancakes.jpg",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "2": {
    "recipeId": "2",
    "imageUrl": "https://blob-url/recipes/1234567891-waffles.jpg",
    "updatedAt": "2024-01-15T11:45:00.000Z"
  }
}
```

### Override Priority

When fetching recipe data:
1. Base recipe data is loaded from `recipesData.ts`
2. Overrides are loaded from Vercel Blob
3. If an override exists for a recipe, its image URL is used
4. Otherwise, the original image URL from `recipesData.ts` is used

### Static vs Dynamic Pages

**Important**: The main recipe pages (`/recipes/[category]/[slug]`) are statically generated at build time. They will show the original images from `recipesData.ts` until you redeploy.

**Dynamic behavior**: The admin panel (`/admin/replace-photos`) uses the API endpoints which apply overrides in real-time, so you can see your changes immediately there.

To see photo changes on the main site:
1. Replace the photo via admin panel
2. Trigger a redeployment in Vercel (or merge to main branch)
3. The static pages will be rebuilt with the new images

## Advantages Over File-Based Approach

1. **Serverless Compatible**: Works in read-only filesystems
2. **No Code Changes**: Update images without modifying source code
3. **No Git Commits**: Changes don't pollute git history
4. **Fast Updates**: Admin panel shows changes immediately
5. **Backup Friendly**: Original data remains untouched
6. **Scalable**: Blob storage handles unlimited images

## Troubleshooting

### Error: "BLOB_READ_WRITE_TOKEN is not configured"

**Solution**: Add the environment variable to your Vercel project settings or `.env.local` file.

### Override not appearing in admin panel

**Check**:
1. Verify BLOB_READ_WRITE_TOKEN is set correctly
2. Check browser console for errors
3. Try refreshing the page

### Changes not visible on main site

**Reason**: Static pages are built at deploy time.

**Solution**: Trigger a redeployment in Vercel.

## Security Considerations

1. **Access Control**: The admin panel (`/admin/*`) should be protected with authentication in production
2. **Token Security**: Never commit `BLOB_READ_WRITE_TOKEN` to git
3. **Image Validation**: Only specific image formats are allowed (JPEG, PNG, WebP, AVIF)
4. **Size Limits**: Images are limited to 5MB maximum

## Future Enhancements

Possible improvements:
- Add authentication to admin panel
- Implement automatic redeployment after image update
- Add bulk image replacement
- Add image history/versioning
- Add preview before publishing
