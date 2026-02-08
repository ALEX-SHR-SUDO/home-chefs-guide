# HomeChef Recipe Website - Deployment Guide

## 🎉 Project Complete!

The HomeChef recipe website is fully built and ready for deployment with:
- **380 unique recipe pages** across 10 categories
- **Fully responsive design** optimized for mobile, tablet, and desktop
- **SEO optimized** with meta tags, Open Graph, and Recipe schema
- **Google AdSense ready** with strategic ad placements
- **399 static pages** generated and ready to deploy

## 📊 Build Statistics

```
✓ Compiled successfully in 3.4s
✓ Generating static pages (399/399) in 1903ms

Total Output:
- 399 HTML pages generated
- 380 recipe pages
- 10 category pages
- 9 static pages (home, about, contact, privacy, terms, etc.)
```

## 🚀 Quick Deployment to Vercel

### Option 1: Deploy via GitHub (Recommended)

1. **Push to GitHub** (already done)
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Framework Preset: Next.js (auto-detected)
   - Click "Deploy"
   - Your site will be live in ~2 minutes!

3. **Add Custom Domain** (Optional)
   - Go to Project Settings → Domains
   - Add your custom domain
   - Update DNS records as shown
   - SSL certificate is automatic

### Option 2: Deploy via Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

## 💰 Google AdSense Integration

### Step 1: Apply for AdSense

1. **Ensure site is deployed** with custom domain (e.g., homechef-recipes.com)
2. **Visit** https://www.google.com/adsense
3. **Sign up** with your Google account
4. **Enter your website URL**
5. **Wait for approval** (typically 1-2 weeks)

### Step 2: Get Ad Codes

Once approved:
1. Log into AdSense dashboard
2. Navigate to "Ads" → "By ad unit"
3. Create ad units for each placement:
   - Header Banner (728x90 / Responsive)
   - Sidebar (300x600 / 300x250)
   - Content (336x280 / 300x250)
   - Footer (728x90 / Responsive)

### Step 3: Replace Placeholders

Find and replace placeholder divs with AdSense code:

**Before:**
```tsx
<div className="ad-space-header">
  AdSense: Header Banner 728x90 / 320x50 (Mobile)
</div>
```

**After:**
```tsx
<div className="ad-space-header">
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX"
       crossorigin="anonymous"></script>
  <ins className="adsbygoogle"
       style="display:block"
       data-ad-client="ca-pub-XXXXXXXXXX"
       data-ad-slot="XXXXXXXXXX"
       data-ad-format="auto"
       data-full-width-responsive="true"></ins>
  <script>
       (adsbygoogle = window.adsbygoogle || []).push({});
  </script>
</div>
```

### Step 4: Rebuild and Deploy

```bash
npm run build
vercel --prod
```

## 🔍 SEO Setup

### 1. Google Search Console

1. **Add Property**
   - Visit https://search.google.com/search-console
   - Add your domain
   - Verify ownership (DNS or HTML file)

2. **Submit Sitemap**
   - Go to "Sitemaps" in left menu
   - Enter: `https://yourdomain.com/sitemap.xml`
   - Click "Submit"

3. **Request Indexing**
   - Go to "URL Inspection"
   - Enter homepage URL
   - Click "Request Indexing"

### 2. Verify Structured Data

1. **Test Recipe Schema**
   - Visit https://search.google.com/test/rich-results
   - Enter a recipe page URL
   - Verify Recipe schema is detected
   - Fix any warnings

### 3. Performance Testing

```bash
npm install -g lighthouse
lighthouse https://yourdomain.com --view
```

**Target Scores:**
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 100

## 📈 Content Strategy

### Growing Your Recipe Site

1. **Regular Updates**
   - Add 5-10 new recipes per week
   - Update seasonal content
   - Refresh popular recipes

2. **SEO Best Practices**
   - Target long-tail keywords (e.g., "easy chicken dinner for two")
   - Write engaging meta descriptions
   - Use descriptive alt text for images
   - Internal linking between related recipes

3. **Content Promotion**
   - Share recipes on Pinterest (food content performs well)
   - Create Instagram posts with recipe links
   - Start a newsletter for new recipes
   - Engage with food communities

4. **User Engagement**
   - Add recipe ratings (future enhancement)
   - Enable comments
   - Create "Most Popular" sections
   - Add "Recipe of the Week"

## 🛠️ Adding New Recipes

### Method 1: Edit recipesData.ts

1. Open `lib/recipesData.ts`
2. Add new recipe object:

```typescript
{
  id: 'dinner-grilled-salmon',
  title: 'Grilled Salmon with Lemon',
  slug: 'grilled-salmon',
  category: 'Dinner Recipes',
  categorySlug: 'dinner',
  description: 'Perfectly grilled salmon with a fresh lemon butter sauce.',
  image: '/images/recipes/grilled-salmon.jpg',
  prepTime: 10,
  cookTime: 15,
  totalTime: 25,
  servings: 4,
  difficulty: 'Easy',
  cuisine: 'American',
  dietaryTags: ['Gluten-Free', 'High-Protein'],
  ingredients: [
    '4 salmon fillets (6 oz each)',
    '2 tablespoons olive oil',
    '2 lemons, sliced',
    '4 cloves garlic, minced',
    'Salt and pepper to taste',
    'Fresh dill for garnish'
  ],
  instructions: [
    'Preheat grill to medium-high heat.',
    'Brush salmon with olive oil and season with salt and pepper.',
    'Place salmon on grill skin-side down.',
    'Grill for 6-7 minutes per side until cooked through.',
    'Serve with lemon slices and fresh dill.'
  ],
  nutrition: {
    calories: 320,
    protein: 34,
    carbs: 2,
    fat: 18
  },
  tips: [
    'Don\'t flip the salmon too early - let it develop a crust.',
    'Use a fish spatula for easier flipping.',
    'Check doneness with a fork - fish should flake easily.'
  ],
  datePublished: '2024-01-15',
  author: 'HomeChef Team'
}
```

3. Rebuild the site:
```bash
npm run build
vercel --prod
```

### Method 2: Recipe Generator Script (Future Enhancement)

Consider creating a recipe entry form or CMS integration for easier content management.

## 🔒 Security

- ✅ No security vulnerabilities detected
- ✅ All dependencies up to date
- ✅ HTTPS enforced by Vercel
- ✅ Privacy Policy and Terms in place
- ✅ AdSense policy compliant

## 📞 Support

For questions or issues:
- Check the main README.md
- Review Next.js documentation: https://nextjs.org/docs
- Vercel support: https://vercel.com/support

## ✅ Pre-Launch Checklist

Before going live:
- [x] 380+ unique recipes generated
- [x] All pages build successfully
- [x] Responsive design tested
- [x] SEO meta tags verified
- [x] AdSense placeholders in place
- [ ] Deploy to production
- [ ] Configure custom domain
- [ ] Submit sitemap to Google
- [ ] Apply for AdSense
- [ ] Test on multiple devices
- [ ] Share on social media

## 🎯 Next Steps

1. **Deploy** the site to Vercel
2. **Configure** custom domain
3. **Submit** to Google Search Console
4. **Apply** for AdSense
5. **Promote** your site

**Your recipe website is ready to generate revenue through AdSense! 🚀**
