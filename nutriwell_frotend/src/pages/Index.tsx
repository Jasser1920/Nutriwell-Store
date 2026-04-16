import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import InfoCardsSection from "@/components/InfoCardsSection";
import ProductHighlight from "@/components/ProductHighlight";
import RecipeGrid from "@/components/RecipeGrid";
import BenefitsSection from "@/components/BenefitsSection";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import heroImage from "@/assets/hero-couple.jpg";
import infoCard1 from "@/assets/info-card-1.jpg";
import infoCard2 from "@/assets/info-card-2.jpg";
import infoCard3 from "@/assets/info-card-3.jpg";
import { fetchPublicPageContent, HomePageContent } from "@/lib/content-service";

const defaultHomeContent: HomePageContent = {
  hero: {
    title: "L'harmonie entre nutrition médicale et vitalité naturelle",
    subtitle:
      "Nutriwell, c'est l'alliance de la science médicale et de la nature fonctionnelle, traduite dans une identité visuelle douce, fiable et épurée.",
    image: heroImage,
    ctaLabel: "Découvrir nos produits",
    ctaHref: "/products",
  },
  infoCards: {
    title: "Votre parcours bien-être commence ici",
    subtitle:
      "Découvrez des conseils validés par des experts pour vous sentir au meilleur de votre forme — de l'activité physique à l'alimentation.",
    cards: [
      { title: "Bien vieillir au quotidien", image: infoCard1, linkLabel: "En savoir plus", linkHref: "#" },
      { title: "Nutrition simplifiée", image: infoCard2, linkLabel: "En savoir plus", linkHref: "#" },
      { title: "Le plaisir dans chaque repas", image: infoCard3, linkLabel: "En savoir plus", linkHref: "#" },
    ],
    ctaLabel: "Découvrir nos conseils",
    ctaHref: "/conseils",
  },
  products: {
    title: "Une gamme pensée pour chaque besoin",
    subtitle: "Découvrez nos produits publiés depuis votre dashboard admin.",
    ctaLabel: "Voir tous les produits",
    ctaHref: "/products",
  },
  recipes: {
    title: "Des idées pour enrichir votre alimentation",
    subtitle:
      "Des recettes simples et savoureuses réalisées avec les produits Nutriwell. Nourrissez votre corps avec des repas que vous aimerez vraiment.",
    ctaLabel: "Explorer toutes les recettes",
    ctaHref: "/recipes",
  },
  benefits: {
    title: "Pourquoi choisir Nutriwell ?",
    items: [
      {
        title: "Formules validées médicalement",
        description:
          "Chaque produit est développé en collaboration avec des professionnels de santé et validé cliniquement.",
      },
      {
        title: "Ingrédients naturels de qualité",
        description: "Nous sélectionnons des ingrédients naturels et de haute qualité pour une nutrition optimale.",
      },
      {
        title: "Fabriqué selon les normes pharmaceutiques",
        description: "Nos produits respectent les standards les plus stricts de fabrication pharmaceutique.",
      },
    ],
  },
};

const Index = () => {
  const { data: content = defaultHomeContent } = useQuery({
    queryKey: ["page-content", "home"],
    queryFn: () => fetchPublicPageContent("home", defaultHomeContent),
  });

  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection content={content.hero} />
      <InfoCardsSection content={content.infoCards} />
      <ProductHighlight content={content.products} />
      <RecipeGrid content={content.recipes} />
      <BenefitsSection content={content.benefits} />
      <Footer />
    </div>
  );
};

export default Index;
