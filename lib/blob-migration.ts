import { put } from '@vercel/blob';
import { readdir, readFile, writeFile, copyFile } from 'fs/promises';
import { join, extname, basename } from 'path';

export interface MigrationMapEntry {
  oldPath: string;
  localFile: string;
  blobUrl: string;
  uploadedAt: string;
  fileSize: number;
}

export interface MigrationResult {
  success: number;
  failed: number;
  total: number;
  errors: { file: string; error: string }[];
  migrationMap: MigrationMapEntry[];
}

const RECIPES_DIR = join(process.cwd(), 'public', 'images', 'recipes');
const BACKUP_DIR = join(process.cwd(), 'lib');
const RECIPES_DATA_PATH = join(BACKUP_DIR, 'recipesData.ts');

/**
 * Get content type based on file extension
 */
function getContentType(ext: string): string {
  const contentTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.avif': 'image/avif',
  };
  return contentTypes[ext.toLowerCase()] || 'image/jpeg';
}

/**
 * Create a backup of recipesData.ts before making changes
 */
export async function createBackup(): Promise<string> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = join(BACKUP_DIR, `recipesData.backup.${timestamp}.ts`);
  
  await copyFile(RECIPES_DATA_PATH, backupPath);
  
  return backupPath;
}

/**
 * Read all image files from the recipes directory
 */
export async function getRecipeImages(): Promise<string[]> {
  const files = await readdir(RECIPES_DIR);
  const imageFiles = files.filter((file) =>
    /\.(jpg|jpeg|png|webp|avif)$/i.test(file)
  );
  
  return imageFiles;
}

/**
 * Upload a single image to Vercel Blob
 */
export async function uploadImageToBlob(
  file: string,
  onProgress?: (message: string) => void
): Promise<MigrationMapEntry> {
  const filePath = join(RECIPES_DIR, file);
  const oldPath = `/images/recipes/${file}`;

  onProgress?.(`Reading ${file}...`);
  
  // Read file
  const fileBuffer = await readFile(filePath);
  const fileSize = fileBuffer.length;

  // Generate unique filename
  const timestamp = Date.now();
  const ext = extname(file);
  const nameWithoutExt = basename(file, ext);
  const sanitizedNameWithoutExt = nameWithoutExt
    .replace(/[^a-z0-9-]/gi, '-')
    .toLowerCase()
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  const blobFilename = `recipes/${timestamp}-${sanitizedNameWithoutExt}${ext}`;

  onProgress?.(`Uploading ${file} to Blob...`);
  
  // Upload to Blob
  const blob = await put(blobFilename, fileBuffer, {
    access: 'public',
    addRandomSuffix: false,
    contentType: getContentType(ext),
  });

  onProgress?.(`✅ Uploaded ${file}`);

  return {
    oldPath,
    localFile: filePath,
    blobUrl: blob.url,
    uploadedAt: new Date().toISOString(),
    fileSize,
  };
}

/**
 * Upload all images to Vercel Blob with progress callback
 */
export async function uploadAllImages(
  onProgress?: (current: number, total: number, message: string) => void
): Promise<MigrationResult> {
  const imageFiles = await getRecipeImages();
  const migrationMap: MigrationMapEntry[] = [];
  const results = {
    success: 0,
    failed: 0,
    total: imageFiles.length,
    errors: [] as { file: string; error: string }[],
    migrationMap: [] as MigrationMapEntry[],
  };

  for (let i = 0; i < imageFiles.length; i++) {
    const file = imageFiles[i];
    
    try {
      onProgress?.(i + 1, imageFiles.length, `Uploading ${file}...`);
      
      const entry = await uploadImageToBlob(file);
      migrationMap.push(entry);
      results.success++;

      // Rate limiting - wait 100ms between uploads
      if (i < imageFiles.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    } catch (error: any) {
      results.failed++;
      results.errors.push({
        file,
        error: error.message,
      });
      onProgress?.(i + 1, imageFiles.length, `❌ Failed: ${file}`);
    }
  }

  results.migrationMap = migrationMap;
  return results;
}

/**
 * Update recipesData.ts with new Blob URLs
 */
export async function updateRecipeUrls(
  migrationMap: MigrationMapEntry[]
): Promise<number> {
  // Read recipesData.ts
  let recipesContent = await readFile(RECIPES_DATA_PATH, 'utf-8');

  // Replace each old path with new Blob URL
  let replacements = 0;
  for (const mapping of migrationMap) {
    const { oldPath, blobUrl } = mapping;
    
    // Use regex to find and replace the image path
    const regex = new RegExp(
      `"image":\\s*"${oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`,
      'g'
    );
    
    const matches = recipesContent.match(regex);
    if (matches) {
      recipesContent = recipesContent.replace(regex, `"image": "${blobUrl}"`);
      replacements += matches.length;
    }
  }

  // Save updated recipesData.ts
  if (replacements > 0) {
    await writeFile(RECIPES_DATA_PATH, recipesContent, 'utf-8');
  }

  return replacements;
}

/**
 * Generate a migration log
 */
export function generateMigrationLog(result: MigrationResult, backupPath: string): string {
  const timestamp = new Date().toISOString();
  
  let log = `==========================================================\n`;
  log += `Image Migration Log\n`;
  log += `==========================================================\n`;
  log += `Timestamp: ${timestamp}\n`;
  log += `Backup Location: ${backupPath}\n`;
  log += `\n`;
  log += `Summary:\n`;
  log += `  Total Images: ${result.total}\n`;
  log += `  ✅ Successful: ${result.success}\n`;
  log += `  ❌ Failed: ${result.failed}\n`;
  log += `\n`;
  
  if (result.migrationMap.length > 0) {
    log += `Migrated Images:\n`;
    log += `${'='.repeat(60)}\n`;
    result.migrationMap.forEach((entry, index) => {
      log += `\n${index + 1}. ${basename(entry.localFile)}\n`;
      log += `   Old Path: ${entry.oldPath}\n`;
      log += `   New URL: ${entry.blobUrl}\n`;
      log += `   Size: ${(entry.fileSize / 1024).toFixed(2)} KB\n`;
      log += `   Uploaded: ${entry.uploadedAt}\n`;
    });
  }
  
  if (result.errors.length > 0) {
    log += `\n${'='.repeat(60)}\n`;
    log += `Errors:\n`;
    log += `${'='.repeat(60)}\n`;
    result.errors.forEach(({ file, error }) => {
      log += `  ❌ ${file}: ${error}\n`;
    });
  }
  
  log += `\n${'='.repeat(60)}\n`;
  log += `End of Log\n`;
  log += `${'='.repeat(60)}\n`;
  
  return log;
}
