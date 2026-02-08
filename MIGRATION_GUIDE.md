# Image Migration to Vercel Blob

This document explains how to use the automated image migration feature to move all recipe images from the git repository to Vercel Blob storage.

## Overview

The migration feature provides a single-button solution to:
- Upload all images from `public/images/recipes/` to Vercel Blob
- Update `lib/recipesData.ts` with new Blob URLs
- Create automatic backups before changes
- Generate detailed migration logs

## Prerequisites

### 1. Vercel Account
You need a Vercel account with:
- **Pro or Enterprise plan** for full functionality (5-minute timeout)
- **Hobby plan** works but with 10-second timeout (may need to reduce image batch size)

### 2. Environment Variable
Set up the `BLOB_READ_WRITE_TOKEN` in your Vercel Dashboard:

1. Go to your project in Vercel Dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add a new variable:
   - **Name**: `BLOB_READ_WRITE_TOKEN`
   - **Value**: Your Vercel Blob token (get from Vercel Blob storage settings)
   - **Environment**: Select all (Production, Preview, Development)
4. Redeploy your application

### 3. Local Development
For local testing, create a `.env.local` file:

```bash
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxx
```

## How to Use

### Step 1: Access Admin Panel
Navigate to the admin migration page:
```
https://your-domain.com/admin/migrate
```

Or locally:
```
http://localhost:3000/admin/migrate
```

### Step 2: Check Status
Click the **"Check Status"** button to:
- Verify the environment variable is configured
- See how many images are ready to migrate

### Step 3: Start Migration
Click the big blue **"Start Migration"** button to begin the process.

The page will show:
- Real-time progress
- Success/failure counters
- Any errors encountered

### Step 4: Review Results
After completion, you'll see:
- **Total Images**: Number of images processed
- **Successful**: Successfully uploaded images
- **Failed**: Any failed uploads with error details
- **URLs Updated**: Number of URLs updated in recipesData.ts
- **Backup Location**: Path to the backup file

### Step 5: Download Log
Click **"Download Migration Log"** to save a detailed log file for your records.

## What Happens During Migration

1. **Backup Creation**: A timestamped backup of `recipesData.ts` is created
   - Format: `lib/recipesData.backup.YYYY-MM-DDTHH-MM-SS-sssZ.ts`

2. **Image Upload**: Each image is:
   - Read from `public/images/recipes/`
   - Given a unique filename with timestamp
   - Uploaded to Vercel Blob with public access
   - Rate-limited (100ms between uploads)

3. **URL Update**: The `recipesData.ts` file is updated:
   - Old paths: `/images/recipes/filename.jpg`
   - New URLs: `https://[blob-id].public.blob.vercel-storage.com/recipes/[timestamp]-filename.jpg`

4. **Log Generation**: A detailed log is created with:
   - Migration summary
   - Each image's old path and new URL
   - File sizes and upload times
   - Any errors encountered

## File Structure

```
app/
  admin/
    migrate/
      page.tsx              # Migration UI page
  api/
    migrate-images/
      route.ts              # Migration API endpoint
lib/
  blob-migration.ts         # Core migration logic
  recipesData.ts            # Recipe data (updated with Blob URLs)
  recipesData.backup.*.ts   # Automatic backups
```

## Technical Details

### API Endpoints

#### GET /api/migrate-images
Check migration readiness and get image count.

**Response:**
```json
{
  "ready": true,
  "imageCount": 380,
  "message": "Ready to migrate"
}
```

#### POST /api/migrate-images
Start the migration process.

**Response:**
```json
{
  "success": true,
  "result": {
    "total": 380,
    "successful": 380,
    "failed": 0,
    "urlsUpdated": 380,
    "backupPath": "lib/recipesData.backup.2026-02-08T18-59-30-123Z.ts",
    "errors": []
  },
  "migrationLog": "..."
}
```

### Supported Image Formats
- JPEG (`.jpg`, `.jpeg`)
- PNG (`.png`)
- WebP (`.webp`)
- AVIF (`.avif`)

### Configuration Options

In `app/api/migrate-images/route.ts`:

```typescript
export const runtime = 'nodejs';        // Use Node.js runtime for fs access
export const dynamic = 'force-dynamic';  // Always run dynamically
export const maxDuration = 300;          // 5 minutes (Pro/Enterprise only)
```

**For Hobby plan**, reduce maxDuration:
```typescript
export const maxDuration = 10;  // 10 seconds maximum for Hobby plan
```

## Troubleshooting

### Error: BLOB_READ_WRITE_TOKEN not set
**Solution**: Configure the environment variable in Vercel Dashboard (see Prerequisites).

### Timeout Error
**Cause**: Too many images for the plan timeout limit.

**Solutions**:
1. Upgrade to Pro/Enterprise plan
2. Reduce `maxDuration` and migrate in smaller batches
3. Use the existing CLI scripts instead (see Alternative Methods)

### Upload Failures
**Common causes**:
- Network issues
- Invalid image files
- Blob storage quota exceeded

**Solution**: Check the error details in the migration results and try again for failed images.

### Local Development Issues
**Cause**: Missing `.env.local` file or token.

**Solution**: Create `.env.local` with your token (see Prerequisites).

## Alternative Methods

If the UI migration doesn't work for your use case, you can use the existing CLI scripts:

```bash
# Upload images to Blob
npm run blob:upload

# Update recipe URLs
npm run blob:update-urls

# Validate migration
npm run blob:validate

# Or run all steps
npm run blob:migrate
```

## Rollback

If you need to rollback:

1. The original `recipesData.ts` is backed up automatically
2. Find the backup file in `lib/recipesData.backup.*.ts`
3. Copy the backup back to `recipesData.ts`:

```bash
cp lib/recipesData.backup.2026-02-08T18-59-30-123Z.ts lib/recipesData.ts
```

## Security Considerations

1. **Token Security**: Never commit `BLOB_READ_WRITE_TOKEN` to git
2. **Access Control**: The migration page is under `/admin/` - add authentication in production
3. **Rate Limiting**: Built-in 100ms delay between uploads to prevent abuse
4. **Environment Isolation**: Use different tokens for development and production

## Best Practices

1. **Test First**: Run on a staging environment before production
2. **Backup Verification**: Verify the backup file is created before migration
3. **Monitor Progress**: Watch the migration in real-time for any issues
4. **Save Logs**: Download and save migration logs for record-keeping
5. **Verify Results**: Check a few recipe pages to ensure images load correctly

## Support

For issues or questions:
- Check the migration log for detailed error messages
- Verify environment variables are set correctly
- Ensure your Vercel plan supports the required timeout duration
- Contact Vercel support for Blob storage issues
