import * as fs from 'fs';
import * as path from 'path';

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

interface ValidationResult {
  file: string;
  valid: boolean;
  errors: string[];
  warnings: string[];
}

interface ValidationReport {
  timestamp: string;
  totalFiles: number;
  validFiles: number;
  invalidFiles: number;
  results: ValidationResult[];
}

class RecipeValidator {
  private report: ValidationReport = {
    timestamp: new Date().toISOString(),
    totalFiles: 0,
    validFiles: 0,
    invalidFiles: 0,
    results: [],
  };

  private validateRequired(recipe: any, field: string): string | null {
    if (!recipe[field]) {
      return `Missing required field: ${field}`;
    }
    return null;
  }

  private validateType(recipe: any, field: string, expectedType: string): string | null {
    const value = recipe[field];
    const actualType = Array.isArray(value) ? 'array' : typeof value;
    
    if (actualType !== expectedType) {
      return `Invalid type for ${field}: expected ${expectedType}, got ${actualType}`;
    }
    return null;
  }

  private validateDifficulty(difficulty: string): string | null {
    const valid = ['Easy', 'Medium', 'Hard'];
    if (!valid.includes(difficulty)) {
      return `Invalid difficulty: ${difficulty}. Must be one of: ${valid.join(', ')}`;
    }
    return null;
  }

  private validateNumber(value: number, field: string, min: number = 0): string | null {
    if (typeof value !== 'number' || isNaN(value)) {
      return `${field} must be a valid number`;
    }
    if (value < min) {
      return `${field} must be >= ${min}`;
    }
    return null;
  }

  private validateArray(value: any[], field: string, minLength: number = 0): string | null {
    if (!Array.isArray(value)) {
      return `${field} must be an array`;
    }
    if (value.length < minLength) {
      return `${field} must have at least ${minLength} items`;
    }
    return null;
  }

  private validateRecipe(recipe: Recipe, filename: string): ValidationResult {
    const result: ValidationResult = {
      file: filename,
      valid: true,
      errors: [],
      warnings: [],
    };

    // Required fields
    const requiredFields = [
      'id', 'title', 'slug', 'category', 'categorySlug', 'description',
      'image', 'prepTime', 'cookTime', 'totalTime', 'servings', 'difficulty',
      'cuisine', 'dietaryTags', 'ingredients', 'instructions', 'nutrition',
      'tips', 'datePublished', 'author',
    ];

    for (const field of requiredFields) {
      const error = this.validateRequired(recipe, field);
      if (error) {
        result.errors.push(error);
        result.valid = false;
      }
    }

    // Type validations
    const stringFields = ['id', 'title', 'slug', 'category', 'categorySlug', 'description', 'image', 'cuisine', 'datePublished', 'author'];
    for (const field of stringFields) {
      if (recipe[field as keyof Recipe]) {
        const error = this.validateType(recipe, field, 'string');
        if (error) {
          result.errors.push(error);
          result.valid = false;
        }
      }
    }

    // Number validations
    if (recipe.prepTime !== undefined) {
      const error = this.validateNumber(recipe.prepTime, 'prepTime');
      if (error) result.errors.push(error);
    }
    if (recipe.cookTime !== undefined) {
      const error = this.validateNumber(recipe.cookTime, 'cookTime');
      if (error) result.errors.push(error);
    }
    if (recipe.totalTime !== undefined) {
      const error = this.validateNumber(recipe.totalTime, 'totalTime');
      if (error) result.errors.push(error);
    }
    if (recipe.servings !== undefined) {
      const error = this.validateNumber(recipe.servings, 'servings', 1);
      if (error) result.errors.push(error);
    }

    // Difficulty validation
    if (recipe.difficulty) {
      const error = this.validateDifficulty(recipe.difficulty);
      if (error) {
        result.errors.push(error);
        result.valid = false;
      }
    }

    // Array validations
    if (recipe.dietaryTags) {
      const error = this.validateArray(recipe.dietaryTags, 'dietaryTags');
      if (error) result.errors.push(error);
    }
    if (recipe.ingredients) {
      const error = this.validateArray(recipe.ingredients, 'ingredients', 1);
      if (error) result.errors.push(error);
    }
    if (recipe.instructions) {
      const error = this.validateArray(recipe.instructions, 'instructions', 1);
      if (error) result.errors.push(error);
    }
    if (recipe.tips) {
      const error = this.validateArray(recipe.tips, 'tips');
      if (error) result.errors.push(error);
    }

    // Nutrition validation
    if (recipe.nutrition) {
      if (typeof recipe.nutrition !== 'object') {
        result.errors.push('nutrition must be an object');
        result.valid = false;
      } else {
        const nutritionFields = ['calories', 'protein', 'carbs', 'fat'];
        for (const field of nutritionFields) {
          const error = this.validateNumber(
            recipe.nutrition[field as keyof typeof recipe.nutrition],
            `nutrition.${field}`
          );
          if (error) result.errors.push(error);
        }
      }
    }

    // Warnings
    if (recipe.prepTime === 0) {
      result.warnings.push('prepTime is 0 - may need manual review');
    }
    if (recipe.cookTime === 0) {
      result.warnings.push('cookTime is 0 - may need manual review');
    }
    if (recipe.ingredients.length === 0) {
      result.warnings.push('No ingredients specified');
    }
    if (recipe.instructions.length === 0) {
      result.warnings.push('No instructions specified');
    }
    if (recipe.nutrition.calories === 0) {
      result.warnings.push('No calorie information - may need manual review');
    }

    // Check if image exists
    const imagePath = path.join(__dirname, '..', recipe.image);
    if (!fs.existsSync(imagePath)) {
      result.warnings.push(`Image file not found: ${recipe.image}`);
    }

    return result;
  }

  async validateAll(): Promise<void> {
    const processedDir = path.join(__dirname, '../data/ocr-results/processed');

    if (!fs.existsSync(processedDir)) {
      console.log('❌ Processed directory not found:', processedDir);
      return;
    }

    const files = fs.readdirSync(processedDir).filter(f => f.endsWith('.json'));
    this.report.totalFiles = files.length;

    console.log(`\n🔍 Validating ${files.length} recipe files...\n`);

    for (const file of files) {
      const filePath = path.join(processedDir, file);
      
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const recipe = JSON.parse(content) as Recipe;
        
        const result = this.validateRecipe(recipe, file);
        this.report.results.push(result);

        if (result.valid) {
          this.report.validFiles++;
          console.log(`✅ ${file}: VALID`);
          if (result.warnings.length > 0) {
            console.log(`   ⚠️  Warnings: ${result.warnings.length}`);
            result.warnings.forEach(w => console.log(`      - ${w}`));
          }
        } else {
          this.report.invalidFiles++;
          console.log(`❌ ${file}: INVALID`);
          console.log(`   Errors: ${result.errors.length}`);
          result.errors.forEach(e => console.log(`      - ${e}`));
          if (result.warnings.length > 0) {
            console.log(`   Warnings: ${result.warnings.length}`);
            result.warnings.forEach(w => console.log(`      - ${w}`));
          }
        }
      } catch (error) {
        this.report.invalidFiles++;
        console.log(`❌ ${file}: PARSE ERROR - ${error}`);
        this.report.results.push({
          file,
          valid: false,
          errors: [`Failed to parse JSON: ${error}`],
          warnings: [],
        });
      }
    }

    this.printSummary();
    this.saveReport();
  }

  private printSummary(): void {
    console.log('\n' + '='.repeat(60));
    console.log('📊 Validation Summary');
    console.log('='.repeat(60));
    console.log(`Total files:        ${this.report.totalFiles}`);
    console.log(`✅ Valid:           ${this.report.validFiles}`);
    console.log(`❌ Invalid:         ${this.report.invalidFiles}`);
    console.log(`📈 Success rate:    ${Math.round((this.report.validFiles / this.report.totalFiles) * 100)}%`);
    console.log('='.repeat(60));

    if (this.report.invalidFiles > 0) {
      console.log('\n⚠️  Some files have validation errors. Please review the report.');
    } else {
      console.log('\n✨ All files passed validation!');
    }
  }

  private saveReport(): void {
    const reportPath = path.join(__dirname, '../data/ocr-results/logs', 'validation-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(this.report, null, 2));
    console.log(`\n📄 Detailed report saved to: ${reportPath}`);
  }
}

async function main() {
  console.log('🚀 OCR Validation Script Started');

  const validator = new RecipeValidator();
  await validator.validateAll();

  console.log('\n✅ Validation completed!');
}

main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
