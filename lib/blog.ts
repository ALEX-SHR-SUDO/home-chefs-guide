export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  datePublished: string;
  category: 'tips' | 'nutrition' | 'recipes';
}

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: '10-essential-cooking-tips-for-beginners',
    title: '10 Essential Cooking Tips for Beginners',
    excerpt:
      'Starting your cooking journey? These 10 fundamental tips will help you build confidence in the kitchen and avoid common mistakes.',
    content: `
      <p>Whether you've just moved out on your own or simply want to start cooking more at home, learning a few key principles can make all the difference. Here are ten essential tips every beginner cook should know.</p>

      <h2>1. Read the Recipe Before You Start</h2>
      <p>Always read through the entire recipe before you begin. This helps you understand the full process, gather all your ingredients, and avoid surprises halfway through cooking.</p>

      <h2>2. Mise en Place — Prepare Everything First</h2>
      <p>This French phrase means "everything in its place." Chop your vegetables, measure your spices, and have all ingredients ready before you turn on the stove. It keeps cooking stress-free.</p>

      <h2>3. Keep Your Knives Sharp</h2>
      <p>A sharp knife is safer and more efficient than a dull one. Dull knives require more force and are more likely to slip. Invest in a good knife and a sharpener.</p>

      <h2>4. Season as You Go</h2>
      <p>Taste your food throughout the cooking process and adjust seasoning gradually. Adding salt and pepper at the end rarely produces the same depth of flavour.</p>

      <h2>5. Control Your Heat</h2>
      <p>Most beginners cook at too high a temperature. Medium heat gives you control and prevents burning. Learn to recognize when a pan is properly preheated.</p>

      <h2>6. Don't Crowd the Pan</h2>
      <p>When sautéing or searing, give ingredients space. Overcrowding causes steaming instead of browning, resulting in soggy food.</p>

      <h2>7. Let Meat Rest</h2>
      <p>After cooking meat, let it rest for a few minutes before cutting. This allows the juices to redistribute, giving you a juicier result.</p>

      <h2>8. Taste Everything</h2>
      <p>The only way to know if your food is properly seasoned is to taste it. Make tasting a habit throughout your cooking.</p>

      <h2>9. Keep a Clean Workspace</h2>
      <p>A tidy kitchen reduces stress and prevents cross-contamination. Clean as you go whenever possible.</p>

      <h2>10. Don't Be Afraid to Fail</h2>
      <p>Every great cook has had plenty of kitchen disasters. Learn from your mistakes and keep experimenting. Cooking gets easier the more you practice.</p>
    `,
    author: 'HomeChef Team',
    datePublished: '2025-01-15',
    category: 'tips',
  },
  {
    id: '2',
    slug: 'understanding-macronutrients-in-home-cooking',
    title: 'Understanding Macronutrients in Home Cooking',
    excerpt:
      'Proteins, carbohydrates, and fats are the building blocks of every meal. Learn how to balance them for a healthier diet without sacrificing flavor.',
    content: `
      <p>When it comes to healthy eating, understanding macronutrients — proteins, carbohydrates, and fats — is key. Here's how to think about them when planning your home-cooked meals.</p>

      <h2>What Are Macronutrients?</h2>
      <p>Macronutrients are the three main categories of nutrients that provide energy (calories) to your body. Each plays a distinct and vital role:</p>
      <ul>
        <li><strong>Proteins</strong> build and repair tissues, support immune function, and keep you feeling full.</li>
        <li><strong>Carbohydrates</strong> are your body's primary energy source, especially for the brain.</li>
        <li><strong>Fats</strong> support cell function, help absorb fat-soluble vitamins, and provide long-lasting energy.</li>
      </ul>

      <h2>How Much of Each Do You Need?</h2>
      <p>General guidelines suggest a balanced plate might include roughly 20–30% protein, 45–55% carbohydrates, and 25–35% fat — though individual needs vary by age, activity level, and health goals.</p>

      <h2>Protein-Rich Foods to Cook With</h2>
      <p>Chicken breast, eggs, lentils, Greek yogurt, tofu, and fish are all excellent sources of protein that work in a wide range of recipes.</p>

      <h2>Choosing Quality Carbohydrates</h2>
      <p>Opt for whole grains, legumes, sweet potatoes, and vegetables over refined carbs. These provide fibre, vitamins, and steady energy rather than spikes and crashes.</p>

      <h2>Healthy Fats in Your Kitchen</h2>
      <p>Olive oil, avocados, nuts, and fatty fish like salmon are great sources of healthy unsaturated fats. Use them generously but mindfully.</p>

      <h2>Practical Tips for Balanced Meals</h2>
      <p>A simple rule is to fill half your plate with vegetables, a quarter with lean protein, and a quarter with a whole grain or starchy vegetable. Add a drizzle of healthy fat for flavour and absorption.</p>
    `,
    author: 'HomeChef Team',
    datePublished: '2025-02-03',
    category: 'nutrition',
  },
  {
    id: '3',
    slug: 'how-to-meal-prep-like-a-pro',
    title: 'How to Meal Prep Like a Pro',
    excerpt:
      'Meal prepping saves time, money, and stress throughout the week. Discover proven strategies to plan, cook, and store meals efficiently.',
    content: `
      <p>Meal prepping — preparing portions of your meals in advance — is one of the most effective habits for eating well and saving time. Here's how to make it work for you.</p>

      <h2>Why Meal Prep?</h2>
      <p>With just a few hours of cooking on the weekend, you can have healthy, ready-to-eat meals throughout the entire week. This reduces the temptation to order takeout, helps you stick to nutritional goals, and saves money.</p>

      <h2>Step 1: Plan Your Menu</h2>
      <p>Choose 3–5 recipes for the week. Aim for variety in protein sources and vegetables, but look for recipes that share common ingredients to keep shopping simple.</p>

      <h2>Step 2: Make a Detailed Shopping List</h2>
      <p>Go through each recipe and write down everything you need. Check your pantry first to avoid buying duplicates. Group items by category (produce, proteins, pantry staples) to speed up your shop.</p>

      <h2>Step 3: Schedule Your Prep Time</h2>
      <p>Block out 2–3 hours on Sunday (or whichever day works best). Start with the items that take longest — roast vegetables, cook grains, and prepare proteins simultaneously.</p>

      <h2>Step 4: Cook Efficiently</h2>
      <p>Use all your burners and your oven at once. While a grain cooks on the stovetop, roast vegetables in the oven and simmer a sauce in another pot.</p>

      <h2>Step 5: Store Properly</h2>
      <p>Use airtight glass containers and label them with the contents and date. Most prepped meals keep well in the fridge for 4–5 days. Freeze anything you won't eat by day 3.</p>

      <h2>Best Foods for Meal Prep</h2>
      <p>Grains (rice, quinoa, oats), roasted vegetables, hard-boiled eggs, cooked chicken, soups, and stews all meal-prep beautifully. Salad greens are best stored separately and dressed just before eating.</p>
    `,
    author: 'HomeChef Team',
    datePublished: '2025-02-20',
    category: 'tips',
  },
  {
    id: '4',
    slug: 'seasonal-cooking-eating-with-the-seasons',
    title: 'Seasonal Cooking: Eating with the Seasons',
    excerpt:
      "Cooking with seasonal produce improves flavor, supports local farmers, and can significantly reduce your grocery bill. Here's how to make the most of what's in season.",
    content: `
      <p>One of the simplest ways to improve your cooking is to use ingredients at their seasonal peak. Seasonal produce is fresher, more flavourful, and often more affordable than out-of-season alternatives.</p>

      <h2>Why Eat Seasonally?</h2>
      <p>Produce that is in season is harvested at peak ripeness, meaning it has higher nutritional value and far superior taste. Out-of-season produce is often picked early and shipped long distances, sacrificing both freshness and flavour.</p>

      <h2>Spring Favourites</h2>
      <p>Look for asparagus, peas, artichokes, spinach, radishes, and strawberries. Spring is ideal for light salads, stir-fries, and fresh pastas.</p>

      <h2>Summer Abundance</h2>
      <p>Summer brings tomatoes, zucchini, corn, bell peppers, peaches, and berries. Grill, roast, or enjoy them raw in vibrant salads and salsas.</p>

      <h2>Autumn Harvests</h2>
      <p>Autumn is the season of squash, pumpkin, apples, pears, mushrooms, and root vegetables. Think hearty soups, stews, and roasted dishes.</p>

      <h2>Winter Warmers</h2>
      <p>Winter features citrus fruits, kale, Brussels sprouts, cabbage, and root vegetables like carrots and parsnips. These are perfect for braises, casseroles, and comforting soups.</p>

      <h2>Tips for Cooking Seasonally</h2>
      <p>Visit your local farmers' market, join a CSA (community-supported agriculture) box programme, or simply check the sale items at your grocery store — discounted produce is often the most seasonal.</p>
    `,
    author: 'HomeChef Team',
    datePublished: '2025-03-10',
    category: 'recipes',
  },
  {
    id: '5',
    slug: 'the-health-benefits-of-cooking-at-home',
    title: 'The Health Benefits of Cooking at Home',
    excerpt:
      "Research consistently shows that people who cook at home eat healthier, spend less money, and enjoy more satisfying meals. Here's why it's worth making the effort.",
    content: `
      <p>In a world of delivery apps and fast food, cooking at home can feel like a chore. But the benefits — for your health, budget, and wellbeing — are substantial.</p>

      <h2>You Control What Goes In</h2>
      <p>Restaurant and packaged food often contains hidden sugars, sodium, and preservatives. When you cook at home, you decide exactly what goes into every dish. This makes it much easier to manage calories, sodium, and nutrient intake.</p>

      <h2>More Vegetables, More Fibre</h2>
      <p>Home cooks naturally tend to include more vegetables in their meals. More vegetables means more fibre, vitamins, and antioxidants — all associated with lower risk of chronic disease.</p>

      <h2>Smaller Portions, Fewer Calories</h2>
      <p>Restaurant portions are notoriously large. Cooking at home lets you serve appropriate portion sizes, which makes a big difference for weight management over time.</p>

      <h2>Financial Savings</h2>
      <p>Even a modest home-cooked meal is typically a fraction of the cost of dining out or ordering delivery. Over a month or year, those savings add up significantly.</p>

      <h2>Mental Health and Mindfulness</h2>
      <p>Cooking can be a meditative, creative activity. Many people find that preparing a meal helps them decompress after a stressful day. Sharing home-cooked food with others also strengthens social bonds.</p>

      <h2>Better Food Literacy</h2>
      <p>When you cook regularly, you naturally learn more about ingredients, nutrition, and flavour combinations. This food literacy empowers better choices even when you do eat out.</p>

      <h2>Getting Started</h2>
      <p>Commit to cooking at home just three or four nights per week and build from there. Start with simple recipes, embrace batch cooking, and keep your pantry stocked with versatile staples.</p>
    `,
    author: 'HomeChef Team',
    datePublished: '2025-03-28',
    category: 'nutrition',
  },
  {
    id: '6',
    slug: 'mastering-the-art-of-homemade-sauces',
    title: 'Mastering the Art of Homemade Sauces',
    excerpt:
      'A great sauce can transform a simple ingredient into an extraordinary meal. Learn the foundational sauces every home cook should know.',
    content: `
      <p>Sauces are the backbone of great cooking. Mastering a handful of core sauces will transform your home cooking and give you the flexibility to improvise confidently.</p>

      <h2>The Five French Mother Sauces</h2>
      <p>Classical French cuisine identifies five "mother sauces" from which hundreds of variations are derived: Béchamel, Velouté, Espagnole, Hollandaise, and Sauce Tomat. Understanding these gives you a framework for endless creativity.</p>

      <h2>Béchamel (White Sauce)</h2>
      <p>Made from butter, flour, and milk, béchamel is the base for cheese sauces, lasagne filling, and creamy gratins. Master the roux (butter + flour) and you'll have it down.</p>

      <h2>A Classic Tomato Sauce</h2>
      <p>Sauté garlic in olive oil, add crushed tomatoes, season with salt and a pinch of sugar, and simmer for 20–30 minutes. This simple sauce works on pasta, pizza, and as a braising liquid.</p>

      <h2>Pan Sauces</h2>
      <p>After searing meat, deglaze the pan with wine or stock, scraping up the browned bits. Reduce until slightly syrupy, whisk in a knob of butter, and you have a rich, restaurant-quality pan sauce in minutes.</p>

      <h2>Vinaigrettes</h2>
      <p>The standard ratio is three parts oil to one part acid (vinegar or lemon juice). Add mustard, garlic, salt, and pepper. Whisk or shake vigorously. This keeps in the fridge for a week and dresses any salad beautifully.</p>

      <h2>Herb Sauces</h2>
      <p>Chimichurri, pesto, and salsa verde are all vibrant, fresh herb sauces that require no cooking. They're quick to make and bring brightness to grilled meats, fish, and vegetables.</p>

      <h2>Tips for Better Sauces</h2>
      <p>Use good-quality stock, taste and adjust seasoning throughout, and don't rush reduction. A little patience produces far more depth of flavour than rushing on high heat.</p>
    `,
    author: 'HomeChef Team',
    datePublished: '2025-04-05',
    category: 'recipes',
  },
];

export function getAllBlogPosts(): BlogPost[] {
  return blogPosts.slice().sort(
    (a, b) => new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime()
  );
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getBlogPostsByCategory(category: string): BlogPost[] {
  return blogPosts
    .filter((post) => post.category === category)
    .sort(
      (a, b) => new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime()
    );
}
