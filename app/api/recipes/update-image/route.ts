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
    
    // Create backup
    const backupPath = path.join(process.cwd(), 'lib', `recipesData.backup.${Date.now()}.ts`);
    fs.writeFileSync(backupPath, fileContent);
    
    // Find and replace the image URL for the specific recipe
    // We need to find the recipe by ID and update its image field
    const recipeRegex = new RegExp(
      `("id":\\s*"${recipeId}"[^}]*"image":\\s*")([^"]+)(")`,
      'g'
    );
    
    const matches = fileContent.match(recipeRegex);
    if (!matches || matches.length === 0) {
      return NextResponse.json(
        { error: `Recipe with ID ${recipeId} not found` },
        { status: 404 }
      );
    }
    
    // Replace the image URL
    const updatedContent = fileContent.replace(recipeRegex, `$1${newImageUrl}$3`);
    
    // Write the updated content back to the file
    fs.writeFileSync(recipesDataPath, updatedContent);
    
    return NextResponse.json({
      success: true,
      message: 'Recipe image updated successfully',
      backupPath: backupPath,
    });
  } catch (error: any) {
    console.error('Error updating recipe image:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update recipe image' },
      { status: 500 }
    );
  }
}
