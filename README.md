# HomeChef - Recipe Website

A modern, SEO-optimized recipe website with 380+ unique recipes, built with Next.js, TypeScript, and Tailwind CSS. Ready for Google AdSense integration and deployment.

![HomeChef](https://img.shields.io/badge/Recipes-380%2B-brightgreen) ![Next.js](https://img.shields.io/badge/Next.js-15.1-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-blue)

## 🌟 Features

### Content
- **380+ Unique Recipes** across 10 categories
- Detailed recipe pages with ingredients, instructions, and nutrition info
- Recipe JSON-LD structured data for rich search results
- Print-friendly recipe cards
- Social media sharing buttons

### Categories
1. Breakfast & Brunch (40 recipes)
2. Lunch Ideas (35 recipes)
3. Dinner Recipes (60 recipes)
4. Appetizers & Snacks (30 recipes)
5. Desserts & Sweets (50 recipes)
6. Baking & Breads (25 recipes)
7. Vegetarian & Vegan (30 recipes)
8. Quick & Easy (40 recipes)
9. Healthy & Diet (30 recipes)
10. International Cuisine (40 recipes)

### Design & UX
- Modern, responsive design (mobile-first approach)
- Clean navigation with category menu
- Prominent search functionality
- Recipe card grid layout
- Professional typography (Inter & Poppins fonts)
- Warm, inviting color scheme optimized for food content

### SEO Optimization
- ✅ Comprehensive meta tags (title, description, keywords)
- ✅ Open Graph tags for social media
- ✅ Recipe Schema.org structured data (JSON-LD)
- ✅ Semantic HTML with proper heading hierarchy
- ✅ Image alt text for all images
- ✅ Clean URLs (`/recipes/[category]/[recipe-name]`)
- ✅ Dynamic sitemap.xml generation
- ✅ Robots.txt file
- ✅ Core Web Vitals optimized

### Google AdSense Ready
Strategic ad placements with placeholder divs:
- **Header Banner**: 728x90 / 320x50 (mobile)
- **Sidebar Ads**: 300x600 / 300x250
- **In-Content Ads**: After intro and instructions
- **Footer Ad**: 728x90 / responsive

### Pages
- Homepage with featured recipes
- Category listing pages
- 380+ individual recipe pages
- About Us page
- Contact page with form
- Privacy Policy page
- Terms of Service page

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ALEX-SHR-SUDO/home-chefs-guide.git
   cd home-chefs-guide
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `out/` directory (static export).

## 📁 Project Structure

```
home-chefs-guide/
├── app/
│   ├── layout.tsx                 # Root layout with header/footer
│   ├── page.tsx                   # Homepage
│   ├── globals.css                # Global styles
│   ├── about/page.tsx             # About page
│   ├── contact/page.tsx           # Contact page
│   ├── privacy-policy/page.tsx    # Privacy policy
│   ├── terms-of-service/page.tsx  # Terms of service
│   ├── robots.ts                  # Robots.txt generator
│   ├── sitemap.ts                 # Sitemap generator
│   └── recipes/
│       └── [category]/
│           ├── page.tsx           # Category page
│           └── [slug]/page.tsx    # Individual recipe page
├── components/
│   ├── Header.tsx                 # Site header with navigation
│   ├── Footer.tsx                 # Site footer
│   ├── RecipeCard.tsx             # Recipe card component
│   ├── PrintButton.tsx            # Print recipe button
│   └── ShareButtons.tsx           # Social sharing buttons
├── lib/
│   ├── types.ts                   # TypeScript interfaces
│   ├── recipes.ts                 # Recipe utilities
│   └── recipesData.ts             # All 380+ recipes data
├── public/
│   ├── images/                    # Image assets
│   └── favicon.svg                # Site favicon
├── next.config.js                 # Next.js configuration
├── tailwind.config.ts             # Tailwind CSS configuration
├── tsconfig.json                  # TypeScript configuration
└── package.json                   # Project dependencies
```

## 🎨 Customization

### Colors
Edit `tailwind.config.ts` to change the color scheme:
```typescript
colors: {
  primary: { /* Your primary color palette */ },
  secondary: { /* Your secondary color palette */ },
}
```

### Fonts
Fonts are configured in `app/layout.tsx`. To use different fonts:
```typescript
import { YourFont } from "next/font/google";
```

### Adding New Recipes
Edit `lib/recipesData.ts` and add new recipe objects following the Recipe interface structure.

## 💰 Google AdSense Integration

### Setup Instructions

1. **Apply for Google AdSense**
   - Visit [Google AdSense](https://www.google.com/adsense)
   - Apply with your deployed website URL
   - Wait for approval (typically 1-2 weeks)

2. **Get Your Ad Codes**
   - Once approved, log into AdSense dashboard
   - Create ad units for each placement
   - Copy the ad code snippets

3. **Replace Placeholders**
   Find placeholder divs with class names:
   - `.ad-space-header` - Header banner ad
   - `.ad-space-sidebar` - Sidebar ads
   - `.ad-space-content` - In-content ads
   - `.ad-space-footer` - Footer ad

4. **Insert Ad Codes**
   Replace the placeholder content with your AdSense code:
   ```tsx
   {/* Before */}
   <div className="ad-space-header">
     AdSense: Header Banner 728x90 / 320x50 (Mobile)
   </div>

   {/* After */}
   <div className="ad-space-header">
     <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX"></script>
     {/* Your ad code here */}
   </div>
   ```

### Best Practices
- Don't exceed 3 ads per page initially
- Use responsive ad units for better mobile experience
- Monitor performance in AdSense dashboard
- Comply with AdSense policies (no click fraud, appropriate content)
- Allow 48 hours for ads to start showing after implementation

## 🚢 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure: Framework Preset = Next.js
   - Click "Deploy"

3. **Custom Domain** (Optional)
   - Add your domain in Vercel settings
   - Update DNS records as instructed
   - SSL certificate is automatic

### Alternative: Netlify

```bash
npm run build
# Upload the 'out' directory to Netlify
```

### Alternative: GitHub Pages

Update `next.config.js`:
```javascript
basePath: '/home-chefs-guide',
```

Then deploy the `out/` folder to GitHub Pages.

## 📊 SEO Verification

### Test Your Structured Data
1. Visit [Google Rich Results Test](https://search.google.com/test/rich-results)
2. Enter your recipe page URL
3. Verify Recipe schema is detected correctly

### Submit Sitemap
1. Visit [Google Search Console](https://search.google.com/search-console)
2. Add your property
3. Submit sitemap: `https://yourdomain.com/sitemap.xml`

### Performance Testing
```bash
npm install -g lighthouse
lighthouse https://yourdomain.com --view
```

Target scores:
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 100

## 🛠️ Technology Stack

- **Framework**: Next.js 15.1 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3.0
- **Fonts**: Google Fonts (Inter, Poppins)
- **Build**: Static Site Generation (SSG)
- **Hosting**: Vercel-ready (also supports Netlify, GitHub Pages)

## 📝 Content Guidelines

### Adding More Recipes

1. Open `lib/recipesData.ts`
2. Add a new recipe object:
   ```typescript
   {
     id: 'category-recipe-name',
     title: 'Recipe Title',
     slug: 'recipe-name',
     category: 'Category Name',
     categorySlug: 'category-slug',
     description: 'Engaging 2-3 sentence description',
     image: '/images/recipes/recipe-name.jpg',
     prepTime: 15,
     cookTime: 30,
     totalTime: 45,
     servings: 4,
     difficulty: 'Easy',
     cuisine: 'American',
     dietaryTags: ['Vegetarian'],
     ingredients: [ /* list of ingredients */ ],
     instructions: [ /* step-by-step instructions */ ],
     nutrition: { calories: 350, protein: 20, carbs: 45, fat: 10 },
     tips: [ /* helpful cooking tips */ ],
     datePublished: '2024-01-15',
     author: 'HomeChef Team',
   }
   ```

3. Rebuild the site: `npm run build`

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or support:
- Email: contact@homechef.com
- Website: [Contact Form](/contact)

## 🎯 Success Metrics

- ✅ 380 unique recipe pages
- ✅ Mobile-responsive design
- ✅ SEO optimized (meta tags, schema, sitemap)
- ✅ Google AdSense ready
- ✅ Fast page load times (target <3 seconds)
- ✅ Valid HTML/CSS
- ✅ Accessibility compliant

## 🔄 Updates

- **v1.0.0** (January 2024) - Initial release with 380+ recipes

---

**Built with ❤️ for home cooks everywhere**
