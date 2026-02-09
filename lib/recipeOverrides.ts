import { put, list } from '@vercel/blob';

const OVERRIDES_BLOB_NAME = 'recipe-overrides.json';

export interface RecipeImageOverride {
  recipeId: string;
  imageUrl: string;
  updatedAt: string;
}

export interface RecipeOverrides {
  [recipeId: string]: RecipeImageOverride;
}

/**
 * Load recipe image overrides from Vercel Blob storage
 */
export async function loadRecipeOverrides(): Promise<RecipeOverrides> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  
  if (!token) {
    // No token configured, return empty overrides
    return {};
  }

  try {
    // List blobs to find our overrides file
    const { blobs } = await list({
      token,
      prefix: OVERRIDES_BLOB_NAME,
      limit: 1,
    });
    
    // If no blob found, return empty object
    if (blobs.length === 0) {
      return {};
    }

    // Fetch the overrides file
    const response = await fetch(blobs[0].url);
    if (!response.ok) {
      console.warn('Failed to fetch recipe overrides');
      return {};
    }

    const overrides = await response.json();
    
    // Validate that overrides is an object
    if (typeof overrides !== 'object' || overrides === null || Array.isArray(overrides)) {
      console.warn('Invalid overrides format, expected object');
      return {};
    }
    
    return overrides;
  } catch (error) {
    console.error('Error loading recipe overrides:', error);
    return {};
  }
}

/**
 * Save recipe image overrides to Vercel Blob storage
 */
export async function saveRecipeOverrides(overrides: RecipeOverrides): Promise<void> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  
  if (!token) {
    throw new Error('BLOB_READ_WRITE_TOKEN is not configured');
  }

  try {
    // Convert to JSON
    const jsonData = JSON.stringify(overrides, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });

    // Upload to Vercel Blob (overwrites if exists)
    await put(OVERRIDES_BLOB_NAME, blob, {
      access: 'public',
      addRandomSuffix: false, // Always use the same name to overwrite
      token,
    });
  } catch (error) {
    console.error('Error saving recipe overrides:', error);
    throw error;
  }
}

/**
 * Update a single recipe's image URL
 */
export async function updateRecipeImage(recipeId: string, imageUrl: string): Promise<void> {
  // Load existing overrides
  const overrides = await loadRecipeOverrides();

  // Add/update this recipe's override
  overrides[recipeId] = {
    recipeId,
    imageUrl,
    updatedAt: new Date().toISOString(),
  };

  // Save back to blob storage
  await saveRecipeOverrides(overrides);
}

/**
 * Get the image URL for a recipe, considering overrides
 */
export function getRecipeImageUrl(recipeId: string, originalUrl: string, overrides: RecipeOverrides): string {
  const override = overrides[recipeId];
  return override ? override.imageUrl : originalUrl;
}
