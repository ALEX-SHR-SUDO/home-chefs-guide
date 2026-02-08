import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { recipeId, newImageUrl } = await request.json();
    
    if (!recipeId || !newImageUrl) {
      return NextResponse.json(
        { error: 'Recipe ID and new image URL are required' },
        { status: 400 }
      );
    }
    
    // Read the recipesData.ts file
    const recipesDataPath = path.join(process.cwd(), 'lib', 'recipesData.ts');
    let fileContent = fs.readFileSync(recipesDataPath, 'utf-8');
    
    // Create backup (only keep the last backup to avoid accumulation)
    const backupPath = path.join(process.cwd(), 'lib', 'recipesData.backup.ts');
    fs.writeFileSync(backupPath, fileContent);
    
    // Escape special regex characters in the recipeId
    const escapedRecipeId = recipeId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Find the recipe object and its image field
    // This regex looks for the recipe with the specific ID and captures the image value
    const recipeRegex = new RegExp(
      `("id":\\s*"${escapedRecipeId}"[\\s\\S]*?"image":\\s*")([^"]+)(")`,
      'g'
    );
    
    // Check if we can find the recipe
    if (!recipeRegex.test(fileContent)) {
      return NextResponse.json(
        { error: `Recipe with ID ${recipeId} not found` },
        { status: 404 }
      );
    }
    
    // Reset regex lastIndex for replacement
    recipeRegex.lastIndex = 0;
    
    // Replace the image URL
    const updatedContent = fileContent.replace(recipeRegex, `$1${newImageUrl}$3`);
    
    // Verify that the update was made
    if (updatedContent === fileContent) {
      return NextResponse.json(
        { error: 'Failed to update image URL' },
        { status: 500 }
      );
    }
    
    // Write the updated content back to the file
    fs.writeFileSync(recipesDataPath, updatedContent);
    
    return NextResponse.json({
      success: true,
      message: 'Recipe image updated successfully',
      backupPath: backupPath,
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
