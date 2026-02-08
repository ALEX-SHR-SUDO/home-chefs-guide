import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

interface ProcessingStats {
  total: number;
  successful: number;
  failed: number;
  skipped: number;
  startTime: Date;
  endTime?: Date;
  duration?: number;
}

class BatchProcessor {
  private stats: ProcessingStats = {
    total: 0,
    successful: 0,
    failed: 0,
    skipped: 0,
    startTime: new Date(),
  };

  private log(message: string) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`);
  }

  public getImageList(): string[] {
    const imagesDir = path.join(__dirname, '../public/images/recipes');
    
    if (!fs.existsSync(imagesDir)) {
      throw new Error(`Images directory not found: ${imagesDir}`);
    }

    return fs.readdirSync(imagesDir)
      .filter(file => /\.(jpg|jpeg|png)$/i.test(file))
      .sort();
  }

  private getProcessedImages(): Set<string> {
    const processedDir = path.join(__dirname, '../data/ocr-results/processed');
    const processed = new Set<string>();

    if (fs.existsSync(processedDir)) {
      fs.readdirSync(processedDir)
        .filter(file => file.endsWith('.json'))
        .forEach(file => {
          const imageName = file.replace('.json', '') + '.jpg';
          processed.add(imageName);
        });
    }

    return processed;
  }

  async processBatch(images: string[], force: boolean = false): Promise<void> {
    this.stats.total = images.length;
    this.log(`Starting batch processing of ${images.length} images`);
    
    const processed = force ? new Set<string>() : this.getProcessedImages();
    
    for (const image of images) {
      if (processed.has(image)) {
        this.log(`⏭️  Skipping ${image} (already processed)`);
        this.stats.skipped++;
        continue;
      }

      try {
        this.log(`\n${'='.repeat(60)}`);
        this.log(`Processing: ${image}`);
        this.log(`${'='.repeat(60)}`);

        // Call the main OCR extraction script
        execSync(`ts-node ${path.join(__dirname, 'ocr-extract.ts')} ${image}`, {
          cwd: path.join(__dirname, '..'),
          stdio: 'inherit',
        });

        this.stats.successful++;
        this.log(`✅ Successfully processed ${image}`);
      } catch (error) {
        this.stats.failed++;
        this.log(`❌ Failed to process ${image}: ${error}`);
      }
    }

    this.stats.endTime = new Date();
    this.stats.duration = this.stats.endTime.getTime() - this.stats.startTime.getTime();
    
    this.printSummary();
    this.saveSummary();
  }

  private printSummary(): void {
    console.log('\n' + '='.repeat(60));
    console.log('📊 Batch Processing Summary');
    console.log('='.repeat(60));
    console.log(`Total images:       ${this.stats.total}`);
    console.log(`✅ Successful:      ${this.stats.successful}`);
    console.log(`❌ Failed:          ${this.stats.failed}`);
    console.log(`⏭️  Skipped:         ${this.stats.skipped}`);
    console.log(`⏱️  Duration:        ${Math.round((this.stats.duration || 0) / 1000)}s`);
    console.log('='.repeat(60));
  }

  private saveSummary(): void {
    const summaryPath = path.join(__dirname, '../data/ocr-results/logs', 'batch-summary.json');
    fs.writeFileSync(summaryPath, JSON.stringify(this.stats, null, 2));
    this.log(`Summary saved to: ${summaryPath}`);
  }
}

async function main() {
  console.log('🚀 OCR Batch Processing Script Started\n');

  const processor = new BatchProcessor();
  
  // Parse command line arguments
  const args = process.argv.slice(2);
  const force = args.includes('--force') || args.includes('-f');
  const limit = args.find(arg => arg.startsWith('--limit='))?.split('=')[1];
  
  // Get list of images to process
  let images = processor.getImageList();
  
  // Limit number of images if specified
  if (limit) {
    const limitNum = parseInt(limit);
    if (!isNaN(limitNum) && limitNum > 0) {
      images = images.slice(0, limitNum);
      console.log(`📋 Limited to first ${limitNum} images`);
    }
  }

  // Process the batch
  await processor.processBatch(images, force);

  console.log('\n✅ Batch processing completed!');
}

main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
