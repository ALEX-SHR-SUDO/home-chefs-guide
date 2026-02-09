import { Metadata } from 'next';
import Link from 'next/link';
import { getRecipe, getAllRecipes, getRecipesByCategory } from '@/lib/recipes';
import RecipeImage from '@/components/RecipeImage';
import PrintButton from '@/components/PrintButton';
import ShareButtons from '@/components/ShareButtons';
import RecipeCard from '@/components/RecipeCard';

interface PageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const allRecipes = getAllRecipes();
  return allRecipes.map((recipe) => ({
    category: recipe.categorySlug,
    slug: recipe.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const recipe = getRecipe(category, slug);
  
  if (!recipe) {
    return {
      title: 'Recipe Not Found',
    };
  }

  return {
    title: recipe.title,
    description: recipe.description,
    keywords: [recipe.title, recipe.category, recipe.cuisine, ...recipe.dietaryTags].join(', '),
    openGraph: {
      title: `${recipe.title} | HomeChef`,
      description: recipe.description,
      images: [recipe.image],
      type: 'article',
    },
  };
}

export default async function RecipePage({ params }: PageProps) {
  const { category, slug } = await params;
  const recipe = getRecipe(category, slug);

  if (!recipe) {
    return (
      <div className="container-custom py-16 text-center">
        <h1 className="text-4xl font-display font-bold mb-4">Recipe Not Found</h1>
        <Link href="/" className="text-primary-600 hover:text-primary-700">
          Return to Home
        </Link>
      </div>
    );
  }

  const relatedRecipes = getRecipesByCategory(category)
    .filter(r => r.id !== recipe.id)
    .slice(0, 3);

  const recipeUrl = `https://homechef-recipes.com/recipes/${category}/${slug}`;

  // Recipe JSON-LD Schema
  const recipeSchema = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.title,
    image: [recipe.image],
    author: {
      '@type': 'Person',
      name: recipe.author,
    },
    datePublished: recipe.datePublished,
    description: recipe.description,
    prepTime: `PT${recipe.prepTime}M`,
    cookTime: `PT${recipe.cookTime}M`,
    totalTime: `PT${recipe.totalTime}M`,
    recipeYield: `${recipe.servings} servings`,
    recipeCategory: recipe.category,
    recipeCuisine: recipe.cuisine,
    keywords: [recipe.title, recipe.category, recipe.cuisine, ...recipe.dietaryTags].join(', '),
    recipeIngredient: recipe.ingredients,
    recipeInstructions: recipe.instructions.map((instruction, index) => ({
      '@type': 'HowToStep',
      text: instruction,
      position: index + 1,
    })),
    nutrition: {
      '@type': 'NutritionInformation',
      calories: `${recipe.nutrition.calories} calories`,
      proteinContent: `${recipe.nutrition.protein}g`,
      carbohydrateContent: `${recipe.nutrition.carbs}g`,
      fatContent: `${recipe.nutrition.fat}g`,
    },
  };

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(recipeSchema) }}
      />

      <div className="min-h-screen bg-gray-50">
        <article className="recipe-content">
          {/* Recipe Header */}
          <div className="bg-white border-b border-gray-200">
            <div className="container-custom py-8">
              {/* Breadcrumb */}
              <nav className="text-sm text-gray-600 mb-6 no-print">
                <Link href="/" className="hover:text-primary-600">Home</Link>
                <span className="mx-2">/</span>
                <Link href={`/recipes/${category}`} className="hover:text-primary-600">
                  {recipe.category}
                </Link>
                <span className="mx-2">/</span>
                <span className="text-gray-900">{recipe.title}</span>
              </nav>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left Column - Title & Meta */}
                <div>
                  <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
                    {recipe.title}
                  </h1>
                  
                  <p className="text-xl text-gray-600 mb-6">
                    {recipe.description}
                  </p>

                  {/* Recipe Meta */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-primary-600">{recipe.prepTime}</div>
                      <div className="text-sm text-gray-600">Prep Time</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-primary-600">{recipe.cookTime}</div>
                      <div className="text-sm text-gray-600">Cook Time</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-primary-600">{recipe.totalTime}</div>
                      <div className="text-sm text-gray-600">Total Time</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-primary-600">{recipe.servings}</div>
                      <div className="text-sm text-gray-600">Servings</div>
                    </div>
                  </div>

                  {/* Additional Meta */}
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600">Difficulty:</span>
                      <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full font-medium">
                        {recipe.difficulty}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600">Cuisine:</span>
                      <span className="px-3 py-1 bg-secondary-100 text-secondary-800 rounded-full font-medium">
                        {recipe.cuisine}
                      </span>
                    </div>
                  </div>

                  {/* Dietary Tags */}
                  {recipe.dietaryTags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {recipe.dietaryTags.map((tag) => (
                        <span key={tag} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-4">
                    <PrintButton />
                    <ShareButtons title={recipe.title} url={recipeUrl} />
                  </div>
                </div>

                {/* Right Column - Image */}
                <div className="relative h-96 lg:h-auto rounded-xl overflow-hidden shadow-xl">
                  <RecipeImage
                    src={recipe.image}
                    alt={recipe.title}
                    width={800}
                    height={600}
                    priority={true}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Ad Space - After Introduction */}
          <div className="container-custom my-8">
            <div className="ad-space-content">
              AdSense: Content Ad 336x280 / 300x250
            </div>
          </div>

          {/* Recipe Content */}
          <div className="container-custom py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-12">
                {/* Ingredients */}
                <section className="bg-white rounded-xl p-8 shadow-md">
                  <h2 className="text-3xl font-display font-bold mb-6">Ingredients</h2>
                  <ul className="space-y-3">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-5 h-5 text-primary-600 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-800">{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                {/* Instructions */}
                <section className="bg-white rounded-xl p-8 shadow-md">
                  <h2 className="text-3xl font-display font-bold mb-6">Instructions</h2>
                  <ol className="space-y-6">
                    {recipe.instructions.map((instruction, index) => (
                      <li key={index} className="flex items-start">
                        <span className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                          {index + 1}
                        </span>
                        <p className="text-gray-800 pt-1">{instruction}</p>
                      </li>
                    ))}
                  </ol>
                </section>

                {/* Ad Space - After Instructions */}
                <div className="ad-space-content">
                  AdSense: Content Ad 336x280 / 300x250
                </div>

                {/* Nutrition Information */}
                <section className="bg-white rounded-xl p-8 shadow-md">
                  <h2 className="text-3xl font-display font-bold mb-6">Nutrition Information</h2>
                  <p className="text-sm text-gray-600 mb-4">Per serving (approximate)</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">{recipe.nutrition.calories}</div>
                      <div className="text-sm text-gray-600">Calories</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">{recipe.nutrition.protein}g</div>
                      <div className="text-sm text-gray-600">Protein</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">{recipe.nutrition.carbs}g</div>
                      <div className="text-sm text-gray-600">Carbs</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">{recipe.nutrition.fat}g</div>
                      <div className="text-sm text-gray-600">Fat</div>
                    </div>
                  </div>
                </section>

                {/* Tips & Notes */}
                {recipe.tips.length > 0 && (
                  <section className="bg-primary-50 rounded-xl p-8 border-2 border-primary-200">
                    <h2 className="text-3xl font-display font-bold mb-6 text-primary-900">
                      Tips & Notes
                    </h2>
                    <ul className="space-y-3">
                      {recipe.tips.map((tip, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-primary-600 mr-3 text-xl">💡</span>
                          <span className="text-gray-800">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  <div className="ad-space-sidebar">
                    AdSense: Sidebar 300x600 / 300x250
                  </div>

                  {/* Related Recipes */}
                  {relatedRecipes.length > 0 && (
                    <div className="bg-white rounded-xl p-6 shadow-md">
                      <h3 className="font-display font-semibold text-xl mb-4">
                        You Might Also Like
                      </h3>
                      <div className="space-y-4">
                        {relatedRecipes.map((related) => (
                          <Link
                            key={related.id}
                            href={`/recipes/${related.categorySlug}/${related.slug}`}
                            className="block group"
                          >
                            <div className="relative h-32 mb-2 rounded-lg overflow-hidden">
                              <RecipeImage
                                src={related.image}
                                alt={related.title}
                                width={300}
                                height={200}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            </div>
                            <h4 className="font-semibold group-hover:text-primary-600 transition-colors line-clamp-2">
                              {related.title}
                            </h4>
                            <p className="text-sm text-gray-600">{related.totalTime} min</p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </>
  );
}
