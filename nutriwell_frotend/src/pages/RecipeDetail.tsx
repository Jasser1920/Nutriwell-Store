import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Users, Printer, ChefHat, Flame, Award, Leaf, Heart, Lightbulb } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WaveDivider from "@/components/WaveDivider";
import ScrollReveal from "@/components/ScrollReveal";
import { fetchPublishedRecipeBySlug, fetchPublishedRecipes } from "@/lib/recipe-service";
import { formatNutritionForDisplay } from "@/lib/nutrition-transformer";

import heroImg from "@/assets/recipe-detail-hero.jpg";
import productThumb from "@/assets/nutriwell-product-thumb.jpg";

const benefits = [
  { icon: Award, text: "Recettes validées par nos nutritionnistes" },
  { icon: Clock, text: "Préparation rapide, moins de 30 min" },
  { icon: Users, text: "Adaptées aux besoins des seniors" },
];

const RecipeDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const [recipe, setRecipe] = useState<any>(null);
  const [similarRecipes, setSimilarRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRecipe = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!slug) {
          setError("Recette non trouvée");
          return;
        }

        // Fetch the recipe by slug
        const recipeData = await fetchPublishedRecipeBySlug(slug);
        if (!recipeData) {
          setError("Cette recette n'existe pas");
          return;
        }

        // Fetch all recipes to get similar ones
        const allRecipes = await fetchPublishedRecipes();
        const similar = allRecipes
          .filter((r) => r.slug !== slug)
          .slice(0, 3)
          .map((r) => ({
            slug: r.slug,
            title: r.title,
            image: r.image || "https://images.unsplash.com/photo-1495544871167-ce0a60e35c02?w=400&h=300&fit=crop",
          }));

        setRecipe({
          ...recipeData,
          // Parse nutrition array for display
          nutritionForDisplay: formatNutritionForDisplay(recipeData.nutrition),
          nutritionTable: recipeData.nutritionTable,
          heroImage: recipeData.image || heroImg,
        });
        setSimilarRecipes(similar);
      } catch (err) {
        console.error("Error loading recipe:", err);
        setError("Erreur lors du chargement de la recette");
      } finally {
        setLoading(false);
      }
    };

    loadRecipe();
  }, [slug]);

  return (
    <div className="min-h-screen bg-background relative">
      {/* Biophilic leaf accent */}
      <div className="fixed bottom-32 right-6 w-20 h-20 opacity-[0.03] animate-gentle-sway pointer-events-none z-0">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 5C50 5 15 30 15 60C15 80 30 95 50 95C70 95 85 80 85 60C85 30 50 5 50 5Z" stroke="hsl(147 100% 37%)" strokeWidth="1.5"/>
          <path d="M50 20V85" stroke="hsl(147 100% 37%)" strokeWidth="1"/>
        </svg>
      </div>
      <Navbar />

      {error && (
        <section className="pt-24 pb-4">
          <div className="container mx-auto px-6">
            <div className="p-4 bg-destructive/10 border border-destructive text-destructive rounded-lg mb-4">
              {error}
            </div>
            <Link to="/recipes" className="text-secondary font-semibold hover:underline">← Retour aux recettes</Link>
          </div>
        </section>
      )}

      {loading && !error && (
        <div className="pt-24 pb-20">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
              <div className="bg-muted rounded-3xl min-h-[420px] animate-pulse" />
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded w-3/4 animate-pulse" />
                <div className="h-12 bg-muted rounded w-full animate-pulse" />
                <div className="h-6 bg-muted rounded w-1/2 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      )}

      {recipe && !loading && (
        <>
      {/* ── Breadcrumb — more breathing room ── */}
      <section className="pt-24 pb-4">
        <div className="container mx-auto px-6">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-all duration-200">Accueil</Link>
            <span className="text-muted-foreground/40">›</span>
            <Link to="/recipes" className="hover:text-primary transition-all duration-200">Nos Recettes</Link>
            <span className="text-muted-foreground/40">›</span>
            <span className="text-foreground font-medium truncate max-w-[240px]">{recipe.title}</span>
          </nav>
        </div>
      </section>

      {/* ── Main Recipe Section (two-col) — improved spacing & hero ── */}
      <section className="py-10 lg:py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
            {/* Left – Hero Image — premium shadow & rounded corners */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <img
                src={recipe.heroImage}
                alt={recipe.title}
                className="w-full h-full min-h-[420px] max-h-[740px] object-cover rounded-3xl shadow-xl"
                width={800}
                height={1024}
              />
            </motion.div>

            {/* Right – Content — refined typography & spacing */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="flex flex-col"
            >
              {/* Category indicator */}
              <div className="flex items-center gap-2.5 mb-4">
                <span className="w-10 h-1 rounded-full bg-secondary" />
                <span className="text-xs font-bold uppercase tracking-widest text-secondary">{recipe.category}</span>
              </div>

              {/* Title + print — larger title */}
              <div className="flex items-start justify-between gap-4 mb-6">
                <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground leading-tight">
                  {recipe.title}
                </h1>
                <button
                  onClick={() => window.print()}
                  className="flex-shrink-0 p-2.5 rounded-xl border border-border text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/5 transition-all duration-200"
                  aria-label="Imprimer la recette"
                >
                  <Printer size={20} />
                </button>
              </div>

              {/* Quick info strip — pill background per item */}
              <div className="flex flex-wrap items-center gap-3 mb-8">
                {[
                  { icon: Users, label: `${recipe.servings} pers.` },
                  { icon: Clock, label: `Prépa : ${recipe.prepTime}` },
                  { icon: ChefHat, label: `Total : ${recipe.totalTime}` },
                ].map((info) => (
                  <span
                    key={info.label}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-sm font-medium text-foreground/70"
                  >
                    <info.icon size={16} className="text-primary" />
                    {info.label}
                  </span>
                ))}
              </div>

              {/* Nutrition block — warm background, bolder values */}
              <div className="bg-secondary/10 border border-secondary/25 rounded-2xl p-5 mb-8">
                <h3 className="text-xs font-bold uppercase tracking-widest text-secondary mb-4">Valeurs nutritionnelles</h3>
                {recipe.nutritionTable?.headers?.length && recipe.nutritionTable?.rows?.length ? (
                  <div className="overflow-x-auto rounded-xl border border-secondary/20 bg-background/70">
                    <table className="w-full min-w-[420px] text-sm">
                      <thead>
                        <tr className="bg-secondary/10">
                          {recipe.nutritionTable.headers.map((header: string, headerIndex: number) => (
                            <th
                              key={`${header}-${headerIndex}`}
                              className={`py-2.5 px-3 font-semibold text-foreground ${headerIndex === 0 ? "text-left" : "text-right"}`}
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {recipe.nutritionTable.rows.map((row: string[], rowIndex: number) => (
                          <tr key={`nutrition-row-${rowIndex}`} className={rowIndex % 2 === 0 ? "bg-background" : "bg-secondary/5"}>
                            {recipe.nutritionTable.headers.map((_: string, colIndex: number) => (
                              <td
                                key={`nutrition-cell-${rowIndex}-${colIndex}`}
                                className={`py-2 px-3 ${colIndex === 0 ? "text-foreground" : "text-right text-muted-foreground"}`}
                              >
                                {row[colIndex] ?? ""}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : recipe.nutritionForDisplay && recipe.nutritionForDisplay.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
                    {recipe.nutritionForDisplay.map((n: any, idx: number) => (
                      <div key={idx} className="text-center py-2">
                        <p className="text-lg font-bold text-foreground leading-none">{n.per100ml}</p>
                        <p className="text-xs font-medium text-secondary mt-1">{n.nutriment}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 opacity-70">{n.perPortion}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Informations nutritionnelles non disponibles</p>
                )}
              </div>

              {/* Associated product — improved hover */}
              <Link
                to="/products"
                className="flex items-center gap-4 p-4 rounded-2xl bg-muted hover:bg-muted/70 hover:shadow-sm transition-all duration-200 mb-8 group"
              >
                <img src={productThumb} alt="Produit Nutriwell" className="w-14 h-14 rounded-xl object-cover" width={56} height={56} loading="lazy" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground font-medium">Découvrez nos produits</p>
                  <p className="text-sm font-bold text-foreground group-hover:text-primary transition-all duration-200 truncate">Nutriwell - Gamme complète</p>
                </div>
                <span className="text-primary text-sm font-bold group-hover:translate-x-0.5 transition-transform duration-200">Voir →</span>
              </Link>

              {/* Ingredients — more spacing */}
              <div className="mb-8">
                <h2 className="font-heading text-xl font-bold text-foreground mb-4 flex items-center gap-2.5">
                  <Leaf size={20} className="text-secondary" /> Ingrédients
                </h2>
                <ul className="space-y-2.5">
                  {recipe.ingredients.map((ing, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-foreground/80 leading-relaxed">
                      <span className="w-2 h-2 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                      {ing}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Preparation steps — better step badges */}
              <div>
                <h2 className="font-heading text-xl font-bold text-foreground mb-4 flex items-center gap-2.5">
                  <ChefHat size={20} className="text-secondary" /> Préparation
                </h2>
                <ol className="space-y-5">
                  {recipe.steps.map((step, i) => (
                    <li key={i} className="flex gap-4">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary text-secondary-foreground text-sm font-bold flex items-center justify-center shadow-sm">
                        {i + 1}
                      </span>
                      <p className="text-sm text-foreground/80 leading-relaxed pt-1">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Tip Block — editorial callout with left accent border ── */}
      {recipe && recipe.tips && recipe.tips.length > 0 && (
        <ScrollReveal>
          <section className="bg-secondary/8 py-14">
            <div className="container mx-auto px-6">
              <div className="max-w-3xl mx-auto flex items-start gap-5 bg-card rounded-2xl p-6 border-l-4 border-secondary shadow-sm">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-secondary/15 flex items-center justify-center">
                  <Lightbulb size={22} className="text-secondary" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-foreground mb-2">Astuce - {recipe.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {recipe.tips[0]}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>
      )}

      {/* ── Similar Recipes — equal-height cards with hover zoom ── */}
      {recipe && similarRecipes.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-6">
            <ScrollReveal>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground text-center mb-10">Découvrez aussi</h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
              {similarRecipes.map((r, i) => (
                <ScrollReveal key={r.slug} delay={i * 0.1}>
                  <Link
                    to={`/recipes/${r.slug}`}
                    className="group flex flex-col bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 h-full"
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={r.image}
                        alt={r.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                        width={400}
                        height={300}
                      />
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-heading text-base font-bold text-foreground group-hover:text-primary transition-all duration-200 flex-1">
                        {r.title}
                      </h3>
                      <span className="text-secondary text-xs font-bold mt-3 inline-block group-hover:translate-x-1 transition-transform duration-200">
                        Voir la recette →
                      </span>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
            <div className="text-center">
              <Link
                to="/recipes"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-secondary text-secondary-foreground font-bold text-sm hover:bg-secondary/90 hover:shadow-md transition-all duration-200"
              >
                Voir toutes les recettes
              </Link>
            </div>
          </div>
        </section>
      )}
        </>
      )}

      {/* ── Benefits Strip — more padding & polish ── */}
      <section className="relative">
        <div className="absolute top-0 left-0 right-0 rotate-180">
          <WaveDivider fillColor="hsl(0 0% 100%)" />
        </div>
        <div className="bg-muted py-20 md:py-24">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-10 text-center">
              {benefits.map((b, i) => (
                <ScrollReveal key={i} delay={i * 0.1}>
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                      <b.icon className="text-primary" size={24} />
                    </div>
                    <p className="text-sm font-bold text-foreground">{b.text}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <WaveDivider fillColor="hsl(var(--brand-dark))" />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default RecipeDetail;
