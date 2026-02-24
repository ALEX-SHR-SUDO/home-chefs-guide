import { put, list, del } from '@vercel/blob';

const OVERRIDES_BLOB_NAME = 'recipe-overrides.json';

// In-memory cache to reduce concurrent Vercel Blob API requests
const CACHE_TTL_MS = 60 * 1000; // 1 minute
let cachedOverrides: RecipeOverrides | null = null;
let cacheExpiry = 0;
let inFlightRequest: Promise<RecipeOverrides> | null = null;
let cacheVersion = 0; // Incremented on invalidation to discard stale in-flight results

export interface RecipeImageOverride {
  recipeId: string;
  imageUrl: string;
  updatedAt: string;
}

export interface RecipeOverrides {
  [recipeId: string]: RecipeImageOverride;
}

/**
 * Fetch recipe image overrides from Vercel Blob storage (no caching)
 */
async function fetchOverridesFromBlob(token: string, version: number): Promise<RecipeOverrides> {
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

    // Only update the cache if it hasn't been invalidated since this fetch started
    if (cacheVersion === version) {
      cachedOverrides = overrides;
      cacheExpiry = Date.now() + CACHE_TTL_MS;
    }

    return overrides;
  } catch (error) {
    console.error('Error loading recipe overrides:', error);
    return {};
  }
}

/**
 * Load recipe image overrides from Vercel Blob storage.
 * Results are cached for CACHE_TTL_MS and concurrent calls share a single request.
 */
export async function loadRecipeOverrides(): Promise<RecipeOverrides> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;

  if (!token) {
    // No token configured, return empty overrides
    return {};
  }

  // Return cached value if still valid
  if (cachedOverrides !== null && Date.now() < cacheExpiry) {
    return cachedOverrides;
  }

  // Deduplicate concurrent in-flight requests
  if (inFlightRequest) {
    return inFlightRequest;
  }

  inFlightRequest = fetchOverridesFromBlob(token, cacheVersion).finally(() => {
    inFlightRequest = null;
  });

  return inFlightRequest;
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

    // Invalidate the cache so the next read fetches fresh data.
    // Incrementing cacheVersion prevents any in-flight read from overwriting
    // the cache with stale data after this invalidation.
    cacheVersion++;
    cachedOverrides = null;
    cacheExpiry = 0;
    inFlightRequest = null;
  } catch (error) {
    console.error('Error saving recipe overrides:', error);
    throw error;
  }
}

/**
 * Check if a URL is a Vercel Blob URL
 */
function isBlobUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname;
    // Vercel Blob URLs have specific hostname patterns
    // Either exactly 'blob.vercel-storage.com' or ends with '.blob.vercel-storage.com'
    // Or ends with '.blob.vercel.app'
    return (
      hostname === 'blob.vercel-storage.com' ||
      hostname.endsWith('.blob.vercel-storage.com') ||
      hostname.endsWith('.blob.vercel.app')
    );
  } catch {
    // Invalid URL, not a blob URL
    return false;
  }
}

/**
 * Delete a blob file from Vercel Blob storage
 */
async function deleteBlobFile(url: string): Promise<void> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  
  if (!token) {
    console.warn('Cannot delete blob file: BLOB_READ_WRITE_TOKEN is not configured');
    return;
  }

  if (!isBlobUrl(url)) {
    console.log('URL is not a blob URL, skipping deletion:', url);
    return;
  }

  try {
    await del(url, { token });
    console.log('Successfully deleted old blob file:', url);
  } catch (error) {
    // Log but don't throw - we don't want deletion failures to block the update
    console.error('Failed to delete old blob file:', url, error);
  }
}

/**
 * Update a single recipe's image URL
 */
export async function updateRecipeImage(recipeId: string, imageUrl: string): Promise<void> {
  // Load existing overrides
  const overrides = await loadRecipeOverrides();

  // Check if there's an existing override with a blob URL to delete
  const existingOverride = overrides[recipeId];
  if (existingOverride?.imageUrl && isBlobUrl(existingOverride.imageUrl)) {
    // Delete the old blob file before updating to the new one
    await deleteBlobFile(existingOverride.imageUrl);
  }

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
