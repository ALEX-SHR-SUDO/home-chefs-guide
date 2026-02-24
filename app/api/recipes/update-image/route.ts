import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { updateRecipeImage } from '@/lib/recipeOverrides';

export async function POST(request: NextRequest) {
  try {
    const { recipeId, newImageUrl } = await request.json();
    
    if (!recipeId || !newImageUrl) {
      return NextResponse.json(
        { error: 'Recipe ID and new image URL are required' },
        { status: 400 }
      );
    }

    // Check if BLOB_READ_WRITE_TOKEN is configured
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        { error: 'BLOB_READ_WRITE_TOKEN is not configured. Please set it in your environment variables.' },
        { status: 500 }
      );
    }
    
    // Update the recipe image in Vercel Blob storage
    await updateRecipeImage(recipeId, newImageUrl);

    // Revalidate all cached pages so the updated image is reflected site-wide
    revalidatePath('/', 'layout');
    
    return NextResponse.json({
      success: true,
      message: 'Recipe image updated successfully',
    });
  } catch (error: unknown) {
    console.error('Error updating recipe image:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update recipe image';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
