import { NextResponse } from 'next/server';
import {
  createBackup,
  uploadAllImages,
  updateRecipeUrls,
  generateMigrationLog,
  getRecipeImages,
  type MigrationResult,
} from '@/lib/blob-migration';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
// Note: maxDuration of 300 seconds (5 minutes) requires Vercel Pro or Enterprise plan
// Hobby plan is limited to 10 seconds. Adjust accordingly based on your plan.
export const maxDuration = 300;

/**
 * GET endpoint to check migration status and get image count
 */
export async function GET() {
  try {
    // Check for BLOB_READ_WRITE_TOKEN
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        {
          error: 'BLOB_READ_WRITE_TOKEN environment variable is not set',
          message: 'Please configure the token in your Vercel Dashboard',
        },
        { status: 500 }
      );
    }

    // Get image count
    const images = await getRecipeImages();
    
    return NextResponse.json({
      ready: true,
      imageCount: images.length,
      message: 'Ready to migrate',
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: 'Failed to check migration status',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * POST endpoint to start the migration process
 */
export async function POST() {
  try {
    // Check for BLOB_READ_WRITE_TOKEN
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        {
          success: false,
          error: 'BLOB_READ_WRITE_TOKEN environment variable is not set',
          message: 'Please configure the token in your Vercel Dashboard under Environment Variables',
        },
        { status: 500 }
      );
    }

    // Create backup before migration
    console.log('Creating backup...');
    const backupResult = await createBackup();
    console.log(backupResult.message);

    // Upload all images with progress tracking
    console.log('Starting image upload...');
    const result: MigrationResult = await uploadAllImages(
      (current, total, message) => {
        console.log(`[${current}/${total}] ${message}`);
      }
    );

    // Update recipesData.ts with new URLs
    console.log('Updating recipe URLs...');
    const urlsUpdated = await updateRecipeUrls(result.migrationMap);
    console.log(`Updated ${urlsUpdated} URLs`);

    // Generate migration log
    const migrationLog = generateMigrationLog(result, backupResult.path || backupResult.message);

    return NextResponse.json({
      success: true,
      result: {
        total: result.total,
        successful: result.success,
        failed: result.failed,
        urlsUpdated,
        backupPath: backupResult.path || backupResult.message,
        backupSuccess: backupResult.success,
        errors: result.errors,
      },
      migrationLog,
    });
  } catch (error: any) {
    console.error('Migration error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Migration failed',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
