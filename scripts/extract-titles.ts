#!/usr/bin/env ts-node

import * as fs from 'fs';
import * as path from 'path';
import config from './config.json';

interface ExtractedData {
  filename: string;
  title: string;
  emoji: string;
}

/**
 * Extract recipe title from SVG file
 * Since the images are SVG files with embedded text, we parse the SVG XML
 */
function extractTitleFromSVG(svgContent: string): { title: string; emoji: string } {
  // Extract title from SVG text element
  const titleMatch = svgContent.match(/<text[^>]*font-weight="bold"[^>]*>([^<]+)<\/text>/);
  const emojiMatch = svgContent.match(/<text[^>]*font-size="120"[^>]*>([^<]+)<\/text>/);
  
  const title = titleMatch ? titleMatch[1].trim() : '';
  const emoji = emojiMatch ? emojiMatch[1].trim() : '🍽️';
  
  return { title, emoji };
}

/**
 * Process all recipe images and extract titles
 */
async function extractTitles(): Promise<void> {
  console.log('🔍 Starting title extraction from recipe images...\n');
  
  const imageDir = path.join(process.cwd(), config.imageDirectory);
  const outputDir = path.join(process.cwd(), config.outputDirectory);
  
  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const extractedData: ExtractedData[] = [];
  const errors: string[] = [];
  
  // Get target recipes or first 10 if not specified
  let recipesToProcess: string[];
  
  if (config.targetRecipes && config.targetRecipes.length > 0) {
    recipesToProcess = config.targetRecipes;
  } else {
    const allFiles = fs.readdirSync(imageDir)
      .filter(file => file.endsWith('.jpg') || file.endsWith('.svg'))
      .slice(0, config.maxRecipes);
    recipesToProcess = allFiles;
  }
  
  console.log(`📝 Processing ${recipesToProcess.length} recipe images:\n`);
  
  for (const filename of recipesToProcess) {
    const imagePath = path.join(imageDir, filename);
    
    try {
      if (!fs.existsSync(imagePath)) {
        console.log(`⚠️  ${filename} - File not found, skipping`);
        errors.push(`${filename}: File not found`);
        continue;
      }
      
      // Read SVG content
      const svgContent = fs.readFileSync(imagePath, 'utf-8');
      
      // Extract title and emoji
      const { title, emoji } = extractTitleFromSVG(svgContent);
      
      if (!title) {
        console.log(`⚠️  ${filename} - Could not extract title`);
        errors.push(`${filename}: Could not extract title`);
        continue;
      }
      
      // Save extracted data
      const outputFile = path.join(outputDir, `${path.parse(filename).name}.json`);
      const data: ExtractedData = {
        filename,
        title,
        emoji
      };
      
      fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));
      extractedData.push(data);
      
      console.log(`✅ ${filename} → "${title}" ${emoji}`);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.log(`❌ ${filename} - Error: ${errorMessage}`);
      errors.push(`${filename}: ${errorMessage}`);
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Extraction Summary:');
  console.log(`   ✅ Successfully extracted: ${extractedData.length}`);
  console.log(`   ❌ Failed: ${errors.length}`);
  console.log('='.repeat(60) + '\n');
  
  if (errors.length > 0) {
    console.log('❌ Errors:');
    errors.forEach(err => console.log(`   - ${err}`));
    console.log();
  }
  
  // Save summary
  const summaryPath = path.join(outputDir, '_extraction_summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    total: recipesToProcess.length,
    successful: extractedData.length,
    failed: errors.length,
    extractedData,
    errors
  }, null, 2));
  
  console.log(`📄 Summary saved to: ${summaryPath}\n`);
}

// Run if called directly
if (require.main === module) {
  extractTitles().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { extractTitles, extractTitleFromSVG };
