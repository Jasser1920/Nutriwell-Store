import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, Users, ChefHat, Sparkles, Heart, Award, Leaf } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WaveDivider from "@/components/WaveDivider";
import ScrollReveal from "@/components/ScrollReveal";
import { fetchPublishedRecipes } from "@/lib/recipe-service";
import { RecipesPageContent, fetchPublicPageContent } from "@/lib/content-service";

import heroImg from "@/assets/recipes-hero.jpg";
import smoothieImg from "@/assets/recipe-smoothie.jpg";
import soupImg from "@/assets/recipe-soup.jpg";
import saladImg from "@/assets/recipe-salad.jpg";
import oatsImg from "@/assets/recipe-oats.jpg";
import salmonImg from "@/assets/recipe-salmon.jpg";
import toastImg from "@/assets/recipe-toast.jpg";

const filters = ["Toutes", "Petit-déjeuner", "Déjeuner", "Snacks", "Boissons"];

const defaultRecipesContent: RecipesPageContent = {
  hero: {
    title: "Nos Recettes et Astuces",
    subtitle: "Des idées gourmandes et nutritives pour prendre soin de vous au quotidien.",
    image: heroImg,
  },
  benefitsStrip: [
    { text: "Recettes validées par nos nutritionnistes" },
    { text: "Préparation rapide, moins de 30 min" },
    { text: "Adaptées aux besoins des seniors" },
  ],
  promos: [
    { title: "Boostez vos recettes", desc: "Ajoutez Nutriwell Boisson Fruitée à vos smoothies pour un apport protéiné complet.", cta: "En savoir plus →" },
    { title: "Astuce bien-être", desc: "Un petit-déjeuner riche en protéines aide à maintenir votre énergie toute la matinée.", cta: "En savoir plus →" },
    { title: "Le saviez-vous ?", desc: "Les fibres alimentaires favorisent une digestion saine et un confort intestinal durable.", cta: "En savoir plus →" },
  ],
};

interface RecipeCard {
  type: "recipe";
  slug: string;
  title: string;
  category: string;
  time: string;
  servings: number;
  image: string;
}

interface PromoCard {
  type: "promo";
  icon: typeof Sparkles;
  title: string;
  desc: string;
  cta: string;
  color: "primary" | "secondary" | "accent";
}


type GridItem = RecipeCard | PromoCard;

const colorMap = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  accent: "bg-accent",
};

const benefitsStrip = [
  { icon: Award, text: "Recettes validées par nos nutritionnistes" },
  { icon: Clock, text: "Préparation rapide, moins de 30 min" },
  { icon: Users, text: "Adaptées aux besoins des seniors" },
];

const Recipes = () => {
  const [active, setActive] = useState("Toutes");
  const [recipes, setRecipes] = useState<RecipeCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { data: pageContent } = useQuery({
    queryKey: ["page-content", "recipes"],
    queryFn: () => fetchPublicPageContent("recipes", defaultRecipesContent),
  });

  const content = pageContent ?? defaultRecipesContent;

  // Fetch recipes from backend
  useEffect(() => {
    const loadRecipes = async () => {
      try {
        setLoading(true);
        setError(null);
        const category = active === "Toutes" ? undefined : active;
        const data = await fetchPublishedRecipes(category);
        
        const recipesCards: RecipeCard[] = data.map((recipe) => ({
          type: "recipe" as const,
          slug: recipe.slug,
          title: recipe.title,
          category: recipe.category,
          time: recipe.prep_time,
          servings: recipe.servings,
          image: recipe.image || "https://images.unsplash.com/photo-1495544871167-ce0a60e35c02?w=512&h=512&fit=crop",
        }));
        
        setRecipes(recipesCards);
      } catch (err) {
        console.error("Error loading recipes:", err);
        setError("Erreur lors du chargement des recettes");
      } finally {
        setLoading(false);
      }
    };

    loadRecipes();
  }, [active]);

  // Promo cards (static content)
  const promoCards: PromoCard[] = [
    { type: "promo", icon: Sparkles, title: content.promos[0]?.title ?? "", desc: content.promos[0]?.desc ?? "", cta: content.promos[0]?.cta ?? "En savoir plus →", color: "primary" },
    { type: "promo", icon: Heart, title: content.promos[1]?.title ?? "", desc: content.promos[1]?.desc ?? "", cta: content.promos[1]?.cta ?? "En savoir plus →", color: "secondary" },
    { type: "promo", icon: Leaf, title: content.promos[2]?.title ?? "", desc: content.promos[2]?.desc ?? "", cta: content.promos[2]?.cta ?? "En savoir plus →", color: "accent" },
  ];

  // Combine recipes and promos for display
  const filtered = recipes.filter((item) => {
    if (active === "Toutes") return true;
    return item.category === active;
  });

  // Inject promos at regular intervals for visual balance
  const gridItems: GridItem[] = [];
  filtered.forEach((recipe, index) => {
    gridItems.push(recipe);
    // Insert promo after every 2 recipes
    if ((index + 1) % 2 === 0 && promoCards.length > 0) {
      gridItems.push(promoCards[Math.floor(Math.random() * promoCards.length)]);
    }
  });

  return (
    <div className="min-h-screen bg-background relative">
      {/* Biophilic leaf accent */}
      <div className="fixed bottom-20 left-4 w-16 h-16 opacity-[0.03] animate-gentle-sway pointer-events-none z-0">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 5C50 5 15 30 15 60C15 80 30 95 50 95C70 95 85 80 85 60C85 30 50 5 50 5Z" stroke="hsl(147 100% 37%)" strokeWidth="1.5"/>
        </svg>
      </div>
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0">
          <img src={content.hero.image || heroImg} alt="Table de recettes saines" className="w-full h-full object-cover" width={1920} height={800} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, hsla(147,100%,37%,0.5) 0%, hsla(196,100%,50%,0.5) 100%)" }} />
        </div>

        <div className="absolute top-24 left-6 md:left-12 z-10 text-sm text-primary-foreground/80">
          <Link to="/" className="hover:text-primary-foreground transition-colors">Accueil</Link>
          <span className="mx-2">›</span>
          <span className="text-primary-foreground font-semibold">Nos Recettes et Astuces</span>
        </div>

        <div className="relative z-10 text-center px-6">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4"
          >
            {content.hero.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-lg text-primary-foreground/90 max-w-xl mx-auto"
          >
            {content.hero.subtitle}
          </motion.p>
        </div>


      </section>

      {/* ── Filter Bar ── */}
      <section className="py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-3">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActive(f)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors duration-200 ${
                  active === f
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent/20"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Recipe Grid ── */}
      <section className="pb-20">
        <div className="container mx-auto px-6">
          {error && (
            <div className="mb-8 p-4 bg-destructive/10 border border-destructive text-destructive rounded-lg">
              {error}
            </div>
          )}
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-muted rounded-2xl overflow-hidden h-80 animate-pulse" />
              ))}
            </div>
          ) : recipes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">Aucune recette trouvée pour cette catégorie.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gridItems.map((item, i) =>
                item.type === "recipe" ? (
                  <ScrollReveal key={i} delay={i * 0.05}>
                    <div className="organic-card overflow-hidden group">
                      <div className="aspect-[4/3] overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                          width={512}
                          height={512}
                        />
                      </div>
                      <div className="p-5">
                        <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                          {item.category}
                        </span>
                        <h3 className="font-heading text-base font-bold text-foreground mt-1 mb-3">
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                          <span className="flex items-center gap-1"><Clock size={14} /> {item.time}</span>
                          <span className="flex items-center gap-1"><Users size={14} /> {item.servings} pers.</span>
                        </div>
                        <Link to={`/recipes/${item.slug}`} className="text-secondary text-sm font-semibold hover:underline">
                          Voir la recette →
                        </Link>
                      </div>
                    </div>
                  </ScrollReveal>
                ) : (
                  /* ── Promo Card ── */
                  <ScrollReveal key={i} delay={i * 0.05}>
                    <div className={`${colorMap[item.color]} rounded-2xl p-8 flex flex-col justify-center h-full min-h-[280px]`}>
                      <item.icon className="text-primary-foreground mb-4" size={32} />
                      <h3 className="font-heading text-xl font-bold text-primary-foreground mb-3">
                        {item.title}
                      </h3>
                      <p className="text-primary-foreground/90 text-sm leading-relaxed mb-5">
                        {item.desc}
                      </p>
                      <a href="#" className="text-primary-foreground text-sm font-semibold underline underline-offset-4">
                        {item.cta}
                      </a>
                    </div>
                  </ScrollReveal>
                )
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── Benefits Strip ── */}
      <section className="relative">
        <div className="absolute top-0 left-0 right-0 rotate-180">
          <WaveDivider fillColor="hsl(0 0% 100%)" />
        </div>
        <div className="bg-muted py-20 md:py-24">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              {benefitsStrip.map((b, i) => (
                <ScrollReveal key={i} delay={i * 0.1}>
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <b.icon className="text-primary" size={22} />
                    </div>
                    <p className="text-sm font-semibold text-foreground">{content.benefitsStrip[i]?.text ?? b.text}</p>
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

export default Recipes;
