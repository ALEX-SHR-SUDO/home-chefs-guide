import * as fs from 'fs';
import * as path from 'path';
const Tesseract = require('tesseract.js');
const sharp = require('sharp');
import OpenAI from 'openai';

interface Recipe {
  id: string;
  title: string;
  slug: string;
  category: string;
  categorySlug: string;
  description: string;
  image: string;
  prepTime: number;
  cookTime: number;
  totalTime: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  cuisine: string;
  dietaryTags: string[];
  ingredients: string[];
  instructions: string[];
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  tips: string[];
  datePublished: string;
  author: string;
}

interface OCRConfig {
  provider: string;
  language: string;
  dpi: number;
  confidenceThreshold: number;
}

const DEFAULT_CONFIG: OCRConfig = {
  provider: process.env.OCR_PROVIDER || 'tesseract',
  language: process.env.OCR_LANGUAGE || 'eng',
  dpi: parseInt(process.env.OCR_DPI || '300'),
  confidenceThreshold: parseInt(process.env.OCR_CONFIDENCE_THRESHOLD || '60'),
};

// First 10 recipe images to process
const TARGET_IMAGES = [
  'naan.jpg',
  'tiramisu.jpg',
  'banoffee-pie.jpg',
  'moroccan-tagine.jpg',
  'edamame.jpg',
  'monkey-bread.jpg',
  'minestrone-soup.jpg',
  'brioche.jpg',
  'chia-pudding.jpg',
];

class OCRExtractor {
  private config: OCRConfig;
  private openai: OpenAI | null = null;

  constructor(config: OCRConfig = DEFAULT_CONFIG) {
    this.config = config;
    
    // Initialize OpenAI if API key is available
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    }
  }

  private log(message: string, type: 'info' | 'error' | 'success' = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
    const logMessage = `${prefix} [${timestamp}] ${message}\n`;
    
    console.log(logMessage.trim());
    
    // Append to log file
    const logFile = path.join(__dirname, '../data/ocr-results/logs', 'extraction.log');
    fs.appendFileSync(logFile, logMessage);
  }

  private async preprocessImage(imagePath: string): Promise<string> {
    try {
      const outputPath = path.join(__dirname, '../data/ocr-results/raw', `preprocessed_${path.basename(imagePath)}`);
      
      await sharp(imagePath)
        .greyscale()
        .normalize()
        .sharpen()
        .threshold(128)
        .toFile(outputPath);
      
      this.log(`Image preprocessed: ${path.basename(imagePath)}`);
      return outputPath;
    } catch (error) {
      this.log(`Error preprocessing image ${imagePath}: ${error}`, 'error');
      throw error;
    }
  }

  private async extractTextWithTesseract(imagePath: string): Promise<string> {
    try {
      this.log(`Starting OCR for ${path.basename(imagePath)}`);
      
      const { data: { text, confidence } } = await Tesseract.recognize(
        imagePath,
        this.config.language,
        {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              process.stdout.write(`\rProgress: ${Math.round(m.progress * 100)}%`);
            }
          },
        }
      );
      
      console.log(''); // New line after progress
      this.log(`OCR completed with confidence: ${confidence?.toFixed(2)}%`);
      
      if (confidence && confidence < this.config.confidenceThreshold) {
        this.log(`Warning: Low confidence score (${confidence.toFixed(2)}%)`, 'error');
      }
      
      return text;
    } catch (error) {
      this.log(`Error in Tesseract OCR: ${error}`, 'error');
      throw error;
    }
  }

  private async structureDataWithAI(rawText: string, imageName: string): Promise<Recipe | null> {
    if (!this.openai) {
      this.log('OpenAI API not configured, skipping AI structuring', 'error');
      return null;
    }

    try {
      const prompt = `Analyze this OCR text from a recipe image and extract structured data.

OCR Text:
${rawText}

Return a valid JSON object matching this TypeScript interface:
{
  id: string;           // Generate a unique ID based on the recipe name
  title: string;        // Recipe title
  slug: string;         // URL-friendly slug
  category: string;     // Main category (e.g., "Desserts", "Main Course", "Appetizers")
  categorySlug: string; // URL-friendly category slug
  description: string;  // Brief description
  image: string;        // Image filename: "${imageName}"
  prepTime: number;     // Prep time in minutes
  cookTime: number;     // Cook time in minutes
  totalTime: number;    // Total time in minutes
  servings: number;     // Number of servings
  difficulty: "Easy" | "Medium" | "Hard";
  cuisine: string;      // Cuisine type (e.g., "Italian", "Indian", "American")
  dietaryTags: string[]; // e.g., ["Vegetarian", "Gluten-Free"]
  ingredients: string[]; // List of ingredients
  instructions: string[]; // Step-by-step instructions
  nutrition: {
    calories: number;
    protein: number;    // grams
    carbs: number;      // grams
    fat: number;        // grams
  };
  tips: string[];       // Cooking tips
  datePublished: string; // ISO date string
  author: string;       // Recipe author
}

Be intelligent about:
- Inferring missing information based on the recipe name
- Categorizing the recipe appropriately
- Estimating cooking times if not specified
- Parsing ingredient lists properly
- Structuring step-by-step instructions
- Providing reasonable nutrition estimates
- Adding helpful cooking tips

Return ONLY the JSON object, no additional text.`;

      this.log('Sending request to OpenAI for data structuring...');
      
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert at extracting structured recipe data from OCR text. Always return valid JSON.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('Empty response from OpenAI');
      }

      // Extract JSON from response (might be wrapped in markdown code blocks)
      let jsonText = content.trim();
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/```\n?/g, '').replace(/```\n?$/g, '');
      }

      const recipe = JSON.parse(jsonText) as Recipe;
      this.log('Successfully structured data with AI', 'success');
      
      return recipe;
    } catch (error) {
      this.log(`Error in AI structuring: ${error}`, 'error');
      return null;
    }
  }

  private createFallbackRecipe(imageName: string, rawText: string): Recipe {
    const baseSlug = imageName.replace('.jpg', '').replace('.png', '');
    const title = baseSlug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return {
      id: `recipe-${Date.now()}-${baseSlug}`,
      title: title,
      slug: baseSlug,
      category: 'Uncategorized',
      categorySlug: 'uncategorized',
      description: `Recipe extracted from ${imageName}. Manual review required.`,
      image: `/images/recipes/${imageName}`,
      prepTime: 0,
      cookTime: 0,
      totalTime: 0,
      servings: 4,
      difficulty: 'Medium',
      cuisine: 'Unknown',
      dietaryTags: [],
      ingredients: rawText.split('\n').filter(line => line.trim().length > 0).slice(0, 10),
      instructions: ['Please review and update this recipe manually.'],
      nutrition: {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      },
      tips: ['This recipe requires manual review.'],
      datePublished: new Date().toISOString(),
      author: 'OCR System',
    };
  }

  async processImage(imageName: string): Promise<void> {
    const imagePath = path.join(__dirname, '../public/images/recipes', imageName);
    const baseSlug = imageName.replace('.jpg', '').replace('.png', '');

    this.log(`\n${'='.repeat(60)}`);
    this.log(`Processing: ${imageName}`);
    this.log(`${'='.repeat(60)}`);

    try {
      // Check if image exists
      if (!fs.existsSync(imagePath)) {
        this.log(`Image not found: ${imagePath}`, 'error');
        return;
      }

      // Preprocess image
      const preprocessedPath = await this.preprocessImage(imagePath);

      // Extract text with OCR
      const rawText = await this.extractTextWithTesseract(preprocessedPath);

      // Save raw OCR text
      const rawTextPath = path.join(__dirname, '../data/ocr-results/raw', `${baseSlug}.txt`);
      fs.writeFileSync(rawTextPath, rawText);
      this.log(`Raw OCR text saved to: ${path.basename(rawTextPath)}`);

      // Structure data with AI (if available)
      let recipe = await this.structureDataWithAI(rawText, imageName);

      // Fallback to basic structure if AI fails
      if (!recipe) {
        this.log('Creating fallback recipe structure');
        recipe = this.createFallbackRecipe(imageName, rawText);
      }

      // Save processed recipe
      const processedPath = path.join(__dirname, '../data/ocr-results/processed', `${baseSlug}.json`);
      fs.writeFileSync(processedPath, JSON.stringify(recipe, null, 2));
      this.log(`Processed recipe saved to: ${path.basename(processedPath)}`, 'success');

      this.log(`✨ Successfully processed ${imageName}`, 'success');
    } catch (error) {
      this.log(`Failed to process ${imageName}: ${error}`, 'error');
    }
  }

  async processAll(): Promise<void> {
    this.log('Starting batch OCR processing...');
    this.log(`Total images to process: ${TARGET_IMAGES.length}`);

    for (let i = 0; i < TARGET_IMAGES.length; i++) {
      this.log(`\nProcessing ${i + 1}/${TARGET_IMAGES.length}`);
      await this.processImage(TARGET_IMAGES[i]);
    }

    this.log('\n' + '='.repeat(60));
    this.log('Batch processing completed!', 'success');
    this.log('='.repeat(60));
  }
}

// Main execution
async function main() {
  console.log('🚀 OCR Extraction Script Started\n');

  // Create necessary directories
  const dirs = [
    path.join(__dirname, '../data/ocr-results/raw'),
    path.join(__dirname, '../data/ocr-results/processed'),
    path.join(__dirname, '../data/ocr-results/logs'),
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  const extractor = new OCRExtractor();

  // Process specific image if provided as argument
  const targetImage = process.argv[2];
  if (targetImage) {
    await extractor.processImage(targetImage);
  } else {
    await extractor.processAll();
  }

  console.log('\n✅ OCR extraction completed!');
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
