# Recipe OCR Automation

Automated system for extracting recipe data from images and populating the recipe database.

## Overview

This system processes recipe images (SVG files with embedded titles) and uses AI to generate complete recipe data including ingredients, instructions, nutritional information, and more.

## Prerequisites

- Node.js 18+ and npm
- OpenAI API key (for recipe generation)
- TypeScript and ts-node

## Installation

1. Install project dependencies:
```bash
npm install
```

2. Install additional dependencies for OCR automation:
```bash
npm install openai tesseract.js ts-node --save-dev
```

3. Set up your OpenAI API key:
```bash
export OPENAI_API_KEY=your-api-key-here
```

Or add it to your `.env` file:
```
OPENAI_API_KEY=your-api-key-here
```

## Configuration

Edit `scripts/config.json` to customize:

- `maxRecipes`: Maximum number of recipes to process (default: 10)
- `imageDirectory`: Path to recipe images (default: `public/images/recipes`)
- `outputDirectory`: Path for OCR output (default: `scripts/ocr-output`)
- `targetRecipes`: Specific recipes to process (or leave empty for first N recipes)
- `defaultAuthor`: Default author name for recipes
- `defaultDifficulty`: Default difficulty level

## Usage

### Option 1: Run Full Pipeline

Process all steps at once:

```bash
npm run ocr:full
```

This will:
1. Extract titles from recipe images
2. Generate complete recipes using AI
3. Add recipes to the database

### Option 2: Run Steps Individually

#### Step 1: Extract Titles

Extract recipe titles from SVG image files:

```bash
npm run ocr:extract
```

Output: `scripts/ocr-output/*.json` with extracted titles

#### Step 2: Generate Recipes

Use OpenAI to generate complete recipe data:

```bash
npm run ocr:parse
```

**Note:** Requires `OPENAI_API_KEY` environment variable.

Output: `scripts/ocr-output/recipes/*.json` with complete recipes

#### Step 3: Add to Database

Integrate generated recipes into `lib/recipesData.ts`:

```bash
npm run ocr:add
```

This will:
- Create a backup of `recipesData.ts`
- Skip duplicate recipes
- Add new recipes to the array

## File Structure

```
scripts/
├── config.json              # Configuration file
├── index.ts                 # Main CLI entry point
├── extract-titles.ts        # Title extraction from SVG
├── generate-recipe.ts       # AI recipe generation
├── add-recipes.ts          # Database integration
├── README.md               # This file
└── ocr-output/             # Output directory
    ├── _extraction_summary.json
    └── recipes/
        ├── _recipes_summary.json
        └── [recipe-id].json
```

## How It Works

### 1. Title Extraction

The system reads SVG files (which are actually XML) and extracts the recipe title from the embedded text elements. It also captures emoji decorations.

**Example SVG:**
```xml
<text font-weight="bold">Naan</text>
<text font-size="120">🥙</text>
```

**Extracted:**
```json
{
  "filename": "naan.jpg",
  "title": "Naan",
  "emoji": "🥙"
}
```

### 2. Recipe Generation

Uses OpenAI's GPT-4 to generate comprehensive recipe data:
- Description
- Prep/cook times
- Servings
- Difficulty level
- Ingredients with measurements
- Step-by-step instructions
- Nutritional information
- Cooking tips

The system infers appropriate categories and cuisines based on recipe titles.

### 3. Data Integration

- Creates backup of existing `recipesData.ts`
- Validates recipes against TypeScript interface
- Checks for duplicates
- Adds new recipes to the array
- Maintains proper formatting

## API Keys

### OpenAI API Key

Required for recipe generation. Get your key at: https://platform.openai.com/api-keys

Set the environment variable:
```bash
export OPENAI_API_KEY=sk-...
```

**Cost Estimate:** Using GPT-4, expect ~$0.03-0.05 per recipe (varies by response length).

## Troubleshooting

### "OPENAI_API_KEY not set"

Make sure you've exported the environment variable:
```bash
export OPENAI_API_KEY=your-key
```

### "Extraction summary not found"

Run `npm run ocr:extract` before running `npm run ocr:parse`.

### "No generated recipes found"

Run `npm run ocr:parse` before running `npm run ocr:add`.

### Recipe already exists

The system automatically skips duplicate recipes. This is normal behavior.

### Build errors

Make sure TypeScript dependencies are installed:
```bash
npm install --save-dev typescript ts-node @types/node
```

### SVG files not found

Check that `config.json` has the correct `imageDirectory` path.

## Examples

### Process specific recipes

Edit `scripts/config.json`:
```json
{
  "targetRecipes": [
    "naan.jpg",
    "tiramisu.jpg",
    "brioche.jpg"
  ]
}
```

Then run:
```bash
npm run ocr:full
```

### Process first 5 recipes

Edit `scripts/config.json`:
```json
{
  "maxRecipes": 5,
  "targetRecipes": []
}
```

### Review generated recipes before adding

```bash
npm run ocr:extract
npm run ocr:parse

# Review files in scripts/ocr-output/recipes/

npm run ocr:add
```

## Output Files

- `scripts/ocr-output/*.json` - Extracted titles per recipe
- `scripts/ocr-output/_extraction_summary.json` - Extraction summary
- `scripts/ocr-output/recipes/*.json` - Generated recipes
- `scripts/ocr-output/recipes/_recipes_summary.json` - Generation summary
- `scripts/ocr-output/_add_recipes_summary.json` - Integration summary
- `lib/recipesData.backup.*.ts` - Backup files (automatic)

## Tips

1. **Test with a few recipes first** - Start with 2-3 recipes to verify everything works
2. **Review AI output** - Check generated recipes in `scripts/ocr-output/recipes/` before adding
3. **Keep backups** - Backups are automatic, but keep the latest one safe
4. **Monitor API costs** - OpenAI API calls cost money; process recipes in batches
5. **Customize prompts** - Edit `generate-recipe.ts` to adjust AI recipe generation

## Advanced Usage

### Using different AI models

Edit `generate-recipe.ts` and change the model:
```typescript
model: 'gpt-4o',  // or 'gpt-4-turbo', 'gpt-3.5-turbo'
```

### Custom recipe categories

Edit the `inferCategoryAndCuisine` function in `generate-recipe.ts` to customize category assignment logic.

### Resume interrupted process

The system is idempotent:
- Extraction: Re-run safely, overwrites previous extractions
- Generation: Re-run safely, overwrites previous recipes
- Addition: Re-run safely, skips duplicates automatically

## License

Same as parent project.
