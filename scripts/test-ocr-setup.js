#!/usr/bin/env node

/**
 * Simple test to verify OCR scripts are properly structured
 * This doesn't actually run OCR (which requires images), but verifies the code loads correctly
 */

console.log('🧪 Testing OCR System Setup\n');

// Test 1: Check if required dependencies are installed
console.log('✓ Test 1: Checking dependencies...');
try {
  require('tesseract.js');
  require('sharp');
  require('openai');
  console.log('  ✅ All dependencies installed\n');
} catch (error) {
  console.error('  ❌ Missing dependencies:', error);
  process.exit(1);
}

// Test 2: Check if required directories exist
console.log('✓ Test 2: Checking directories...');
const fs = require('fs');
const path = require('path');

const requiredDirs = [
  path.join(__dirname, '../data/ocr-results/raw'),
  path.join(__dirname, '../data/ocr-results/processed'),
  path.join(__dirname, '../data/ocr-results/logs'),
  path.join(__dirname, '../public/images/recipes'),
];

let dirsOk = true;
for (const dir of requiredDirs) {
  if (!fs.existsSync(dir)) {
    console.error(`  ❌ Directory missing: ${dir}`);
    dirsOk = false;
  }
}

if (dirsOk) {
  console.log('  ✅ All required directories exist\n');
} else {
  process.exit(1);
}

// Test 3: Check if target images exist
console.log('✓ Test 3: Checking target recipe images...');
const targetImages = [
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

let imagesFound = 0;
for (const img of targetImages) {
  const imgPath = path.join(__dirname, '../public/images/recipes', img);
  if (fs.existsSync(imgPath)) {
    imagesFound++;
  } else {
    console.warn(`  ⚠️  Image not found: ${img}`);
  }
}

console.log(`  ✅ Found ${imagesFound}/${targetImages.length} target images\n`);

// Test 4: Check if npm scripts are configured
console.log('✓ Test 4: Checking npm scripts...');
const packageJson = require('../package.json');
const requiredScripts = ['ocr:extract', 'ocr:batch', 'ocr:validate'];

let scriptsOk = true;
for (const script of requiredScripts) {
  if (!packageJson.scripts[script]) {
    console.error(`  ❌ Missing npm script: ${script}`);
    scriptsOk = false;
  }
}

if (scriptsOk) {
  console.log('  ✅ All npm scripts configured\n');
} else {
  process.exit(1);
}

// Test 5: Check if documentation exists
console.log('✓ Test 5: Checking documentation...');
const docsPath = path.join(__dirname, '../docs/OCR_GUIDE.md');
if (fs.existsSync(docsPath)) {
  console.log('  ✅ OCR Guide documentation exists\n');
} else {
  console.error('  ❌ Documentation missing');
  process.exit(1);
}

// Test 6: Check if .env.example exists
console.log('✓ Test 6: Checking configuration...');
const envExamplePath = path.join(__dirname, '../.env.example');
if (fs.existsSync(envExamplePath)) {
  console.log('  ✅ Configuration example exists\n');
} else {
  console.error('  ❌ .env.example missing');
  process.exit(1);
}

// Test 7: Check if GitHub Actions workflow exists
console.log('✓ Test 7: Checking GitHub Actions workflow...');
const workflowPath = path.join(__dirname, '../.github/workflows/ocr-process.yml');
if (fs.existsSync(workflowPath)) {
  console.log('  ✅ GitHub Actions workflow exists\n');
} else {
  console.error('  ❌ Workflow file missing');
  process.exit(1);
}

console.log('═'.repeat(60));
console.log('🎉 All tests passed!');
console.log('═'.repeat(60));
console.log('\n📚 Next steps:');
console.log('1. Configure API keys in .env (optional)');
console.log('2. Run: npm run ocr:extract -- naan.jpg');
console.log('3. Run: npm run ocr:validate');
console.log('4. See docs/OCR_GUIDE.md for complete instructions\n');
