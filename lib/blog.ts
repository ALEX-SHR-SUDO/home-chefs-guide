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
      <p>A great sauce has the power to turn a humble piece of chicken into something memorable, elevate a simple bowl of pasta into a restaurant-worthy dish, or transform a plain salad into something you crave every single day. Yet despite their transformative power, sauces intimidate many home cooks. The truth is, once you understand a handful of core techniques, making great sauces becomes intuitive — and endlessly rewarding.</p>

      <p>Whether you are cooking for one on a quiet Tuesday evening or hosting a dinner party for twelve, sauces are your most versatile culinary tool. They add richness, brightness, depth, and complexity. They tie together the components of a dish and communicate the cook's intentions. In this guide, we will walk through the foundational sauces every home cook should know: how to make them, when to use them, and how to build your confidence one ladle at a time.</p>

      <h2>The Five French Mother Sauces</h2>
      <p>Classical French cuisine, codified by chef Auguste Escoffier in the late-nineteenth-century culinary canon, identified five "mother sauces" as the cornerstones of Western culinary tradition. Every sauce you have encountered in a French-inspired kitchen almost certainly derives from one of these five foundations:</p>
      <ul>
        <li><strong>Béchamel</strong> — a white sauce made from milk thickened with a butter-and-flour roux</li>
        <li><strong>Velouté</strong> — a blond sauce made from light chicken, veal, or fish stock and a pale roux</li>
        <li><strong>Espagnole</strong> — a rich, dark brown sauce based on roasted bones, aromatics, and tomato paste</li>
        <li><strong>Hollandaise</strong> — a luxurious emulsified butter sauce enriched with egg yolks and lemon</li>
        <li><strong>Sauce Tomate</strong> — a slow-cooked tomato sauce, the ancestor of every ragù and sugo you love</li>
      </ul>
      <p>Each mother sauce is a template. Understand how it works and you unlock dozens of classic derivatives. Mastering even two or three of these will permanently change the way you cook.</p>

      <h2>Béchamel — The Versatile White Sauce</h2>
      <p>Béchamel is the most accessible of the mother sauces and one of the most useful. At its simplest, it is made by cooking equal parts butter and flour together into a roux, then whisking in warm milk until the sauce becomes smooth and thick. The key is patience: add the milk gradually, whisking constantly to prevent lumps, and cook over medium-low heat until the sauce coats the back of a spoon.</p>
      <p>Once you can make a reliable béchamel, your cooking options multiply dramatically. Add grated Gruyère or Parmesan to make a Mornay sauce — perfect for macaroni and cheese or a classic croque monsieur. Layer it generously into a <a href="https://easyhomechef.com/recipes/dinner/lasagna">classic lasagna</a> alongside a rich meat ragù for a dish that never fails to impress. Thin it slightly with cream and spoon it over chicken, baked potatoes, or bubbling gratins. Season it with freshly grated nutmeg, Dijon mustard, or white pepper to change its character entirely.</p>
      <p>The most common mistake with béchamel is cooking the roux for too short a time, which leaves a raw flour taste in the finished sauce. Cook the butter and flour together for at least two full minutes before adding any liquid, stirring frequently as it gently bubbles.</p>

      <h2>Classic Tomato Sauce — Simple and Endlessly Adaptable</h2>
      <p>A truly great tomato sauce is one of the simplest and most satisfying things you can make. Start with good-quality crushed tomatoes — ideally San Marzano — and build flavour patiently. Sauté finely chopped garlic and onion in good olive oil over medium heat until soft and golden. Add the tomatoes, a pinch of sugar to balance the acidity, salt, and a few fresh basil leaves. Simmer uncovered for 25–35 minutes, stirring occasionally, until the sauce has thickened and the flavours have deepened into something rich and harmonious.</p>
      <p>From this simple base, variations are endless. Add dried chilli flakes and capers for arrabbiata. Deglaze with red wine for a heartier sugo. Stir in cream and smoked pancetta for a tomato cream sauce. This sauce works beautifully over pasta, as a braising base for meats, or poured over breaded chicken. It is the essential component of a perfect <a href="https://easyhomechef.com/recipes/dinner/chicken-parmesan">Chicken Parmesan</a> — crispy, saucy, and deeply satisfying. Make a large batch and freeze it in portions for those busy weeknight evenings when time is short.</p>

      <h2>Pan Sauces — Restaurant Quality in Minutes</h2>
      <p>Pan sauces are arguably the most underused tool in the home cook's repertoire. Whenever you sear a steak, chicken breast, or pork chop in a heavy skillet, you simultaneously create something valuable: the fond. Those golden-brown bits stuck to the bottom of the pan after cooking are concentrated flavour, and the technique of deglazing — adding liquid to the hot pan and scraping up the fond — transforms them into the base of a remarkable sauce in just minutes.</p>
      <p>After removing your cooked protein to rest, pour off any excess fat from the pan, leaving just a thin film. Add your deglazing liquid — wine, stock, or a combination — and let it sizzle vigorously. Scrape up every last bit of fond as the liquid lifts it from the pan. Reduce the sauce by half, then swirl in one or two tablespoons of cold butter off the heat to finish. This technique — called <em>monter au beurre</em> — gives the sauce a glossy, velvety texture that is almost impossible to achieve any other way.</p>
      <p>This method is the foundation of beloved classics such as <a href="https://easyhomechef.com/recipes/dinner/chicken-marsala">Chicken Marsala</a>, where Marsala wine and earthy mushrooms form the base, and <a href="https://easyhomechef.com/recipes/dinner/chicken-piccata">Chicken Piccata</a>, with its bright, sharp lemon and caper sauce. Add chopped shallots, a sprig of fresh thyme, or a splash of double cream to adapt the flavour to whatever protein you are cooking.</p>

      <h2>Vinaigrettes — The No-Cook Sauce</h2>
      <p>Vinaigrette is the most democratic of all sauces — it requires no heat, no special equipment, and barely five minutes to make. The classic ratio is three parts oil to one part acid (vinegar or fresh lemon juice). Add a small spoonful of Dijon mustard, which acts as an emulsifier and helps the dressing hold together, along with salt, freshly cracked pepper, and any aromatics you like. Whisk vigorously or shake in a jar until the dressing is smooth and creamy-looking.</p>
      <p>The beauty of vinaigrette is how effortlessly it adapts. Use red wine vinegar and a pinch of smoked paprika for a Spanish-inspired dressing. Try balsamic vinegar with a teaspoon of honey for something sweeter and more complex. Fresh tarragon, chives, or flat-leaf parsley make a wonderful herb vinaigrette. A well-made dressing transforms every salad it touches — from a simple green salad to a composed <a href="https://easyhomechef.com/recipes/lunch/caesar-salad">Caesar Salad</a> or a vibrant <a href="https://easyhomechef.com/recipes/lunch/pasta-salad">Pasta Salad</a>. Make a jar at the weekend and keep it in the refrigerator for up to two weeks.</p>

      <h2>Fresh Herb Sauces — Pesto, Chimichurri, and Salsa Verde</h2>
      <p>Fresh herb sauces are among the most vibrant, versatile preparations in cooking, and none of them requires heat. <strong>Pesto</strong>, originating in Genoa, is made by blending fresh basil, toasted pine nuts, garlic, Parmesan, and olive oil into a fragrant, intensely green sauce. It coats pasta beautifully, works as a sandwich spread, and can be stirred into risotto or spooned over roasted vegetables.</p>
      <p><strong>Chimichurri</strong> is an Argentinian herb sauce built from flat-leaf parsley, garlic, red wine vinegar, and olive oil, with chilli flakes for warmth. It is the classic companion to grilled meats and brings extraordinary freshness to anything it touches. <strong>Salsa verde</strong> is its Italian cousin — a loose, pungent sauce of parsley, capers, anchovies, garlic, and lemon, sharp and savoury and endlessly adaptable.</p>
      <p>All three pair brilliantly with fish. Try a generous spoonful of herb sauce over our <a href="https://easyhomechef.com/recipes/dinner/grilled-salmon">Grilled Salmon</a> for an effortless, impressive dinner. For a rich, creamy pasta experience on the other end of the spectrum, our <a href="https://easyhomechef.com/recipes/dinner/chicken-alfredo">Chicken Alfredo</a> showcases how a well-made cream sauce can be every bit as satisfying.</p>

      <h2>Common Mistakes to Avoid</h2>
      <p>Even experienced cooks make predictable errors when making sauces. Here are the most common pitfalls to watch for:</p>
      <ul>
        <li><strong>Rushing the reduction:</strong> Turning up the heat to speed a sauce along breaks down its texture and can make it taste harsh and sharp. Reduce patiently over medium or medium-low heat.</li>
        <li><strong>Adding butter to a boiling sauce:</strong> Always remove the pan from direct heat before finishing with butter. Boiling temperature will cause the fat to separate rather than emulsify into a smooth sauce.</li>
        <li><strong>Not seasoning in layers:</strong> Great sauces are seasoned throughout the cooking process, not only at the end. Taste regularly and adjust as you go — this is how you build depth.</li>
        <li><strong>Using poor-quality stock:</strong> Stock is the backbone of many sauces. If yours tastes thin and bland, your finished sauce will too. Use homemade stock when possible, or choose a quality store-bought version.</li>
        <li><strong>Discarding the fond:</strong> Never rinse a pan immediately after searing meat — the caramelised residue left behind is liquid gold. Always deglaze it and use it.</li>
      </ul>

      <h2>Start Simple, Build Confidence</h2>
      <p>Mastering sauces is one of the most rewarding investments you can make as a home cook. You do not need to tackle all five mother sauces at once. Start with one — perhaps a simple béchamel or a vibrant chimichurri — and cook with it until it feels natural. Then try another. Over time, these techniques will become part of your instinctive cooking vocabulary, and you will find yourself improvising sauces confidently without ever reaching for a recipe. The kitchen is yours to explore. One sauce at a time, you will get there.</p>
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
