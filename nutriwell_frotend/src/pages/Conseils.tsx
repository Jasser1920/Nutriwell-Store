import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Heart, Leaf, Sparkles, Stethoscope, SunMedium } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WaveDivider from "@/components/WaveDivider";
import ScrollReveal from "@/components/ScrollReveal";
import adviceHero from "@/assets/about-products.jpg";
import { ConseilsPageContent, fetchPublicPageContent } from "@/lib/content-service";

const defaultConseilsContent: ConseilsPageContent = {
  hero: {
    title: "Découvrir nos conseils",
    subtitle:
      "Des repères simples et utiles pour mieux accompagner la nutrition au quotidien, avec des gestes concrets, des idées de repas et des habitudes faciles à suivre.",
    image: adviceHero,
    ctaLabel: "Voir les recettes",
    ctaHref: "/recipes",
  },
  intro: {
    badge: "Conseils pratiques",
    title: "Des repères simples, alignés avec l'esprit Nutriwell",
    text: "Une page pensée pour les visiteurs qui veulent agir concrètement, sans jargon, avec des conseils clairs et applicables.",
  },
  adviceCards: [
    {
      icon: "Stethoscope",
      title: "Parlez d'abord à un professionnel de santé",
      text: "Chaque profil est différent. Un conseil bien ciblé commence par une bonne évaluation des besoins, des contraintes et du contexte médical.",
    },
    {
      icon: "Heart",
      title: "Choisissez la régularité avant la perfection",
      text: "De petits gestes répétés chaque jour sont souvent plus efficaces qu'un changement radical difficile à tenir dans le temps.",
    },
    {
      icon: "Leaf",
      title: "Composez des repas simples et rassurants",
      text: "Miser sur des ingrédients familiers, une texture agréable et des portions adaptées aide à garder l'envie de manger.",
    },
    {
      icon: "SunMedium",
      title: "Soutenez l'énergie sur toute la journée",
      text: "Répartir les apports entre repas et collations peut aider à maintenir confort, énergie et plaisir alimentaire.",
    },
  ],
  quickLinks: [
    {
      title: "Explorer les recettes",
      text: "Des idées concrètes pour cuisiner avec les produits Nutriwell.",
      href: "/recipes",
    },
    {
      title: "Découvrir les produits",
      text: "Trouvez la formule adaptée au besoin nutritionnel recherché.",
      href: "/products",
    },
  ],
};

const iconMap: Record<string, typeof Stethoscope> = {
  Stethoscope,
  Heart,
  Leaf,
  SunMedium,
};

const linkIconMap: Record<string, typeof BookOpen> = {
  BookOpen,
  Sparkles,
};

const Conseils = () => {
  const { data } = useQuery({
    queryKey: ["page-content", "conseils"],
    queryFn: () => fetchPublicPageContent("conseils", defaultConseilsContent),
  });

  const hero = data?.hero ?? defaultConseilsContent.hero;
  const content = data ?? defaultConseilsContent;

  return (
    <div className="min-h-screen bg-background relative">
      <div className="fixed bottom-20 left-4 w-16 h-16 opacity-[0.03] animate-gentle-sway pointer-events-none z-0">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 5C50 5 15 30 15 60C15 80 30 95 50 95C70 95 85 80 85 60C85 30 50 5 50 5Z" stroke="hsl(147 100% 37%)" strokeWidth="1.5" />
        </svg>
      </div>

      <Navbar />

      <section className="relative min-h-[55vh] flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0">
          <img src={hero.image || adviceHero} alt={hero.title} className="w-full h-full object-cover" width={1920} height={800} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, hsla(147,100%,37%,0.5) 0%, hsla(196,100%,50%,0.5) 100%)" }} />
        </div>

        <div className="absolute top-24 left-6 md:left-12 z-10 text-sm text-primary-foreground/80">
          <Link to="/" className="hover:text-primary-foreground transition-colors">Accueil</Link>
          <span className="mx-2">›</span>
          <span className="text-primary-foreground font-semibold">Découvrir nos conseils</span>
        </div>

        <div className="relative z-10 text-center px-6 max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4"
          >
            {hero.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-lg text-primary-foreground/90 max-w-2xl mx-auto"
          >
            {hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <Link to={hero.ctaHref} className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-8 py-3.5 rounded-full font-semibold hover:bg-secondary/90 hover:shadow-md transition-all duration-200 text-[15px]">
              {hero.ctaLabel}
            </Link>
            <Link to="/about" className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-8 py-3.5 font-semibold text-primary-foreground backdrop-blur-sm hover:bg-white/15 transition-all">
              Notre histoire
            </Link>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-10">
          <WaveDivider fillColor="hsl(140 20% 99%)" />
        </div>
      </section>

      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto text-center mb-14">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary mb-4">
                <Leaf size={16} /> {content.intro.badge}
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
                {content.intro.title}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {content.intro.text}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid gap-6 md:grid-cols-2">
            {content.adviceCards.map((card, index) => {
              const Icon = iconMap[card.icon] ?? Stethoscope;
              return (
                <ScrollReveal key={card.title} delay={index * 0.12}>
                  <div className="organic-card h-full rounded-2xl p-7">
                    <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10">
                      <Icon className="text-secondary" size={22} />
                    </div>
                    <h3 className="font-heading text-xl font-bold text-foreground mb-3">{card.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{card.text}</p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative py-20 bg-muted overflow-hidden">
        <div className="absolute top-0 left-0 right-0 rotate-180">
          <WaveDivider fillColor="hsl(0 0% 100%)" />
        </div>
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">Aller plus loin</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Utilisez ces pages pour passer du conseil à l'action avec des recettes et des produits adaptés.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid gap-6 md:grid-cols-2">
            {content.quickLinks.map((item, index) => {
              const Icon = linkIconMap[index === 0 ? "BookOpen" : "Sparkles"] ?? BookOpen;
              return (
                <ScrollReveal key={item.title} delay={index * 0.12}>
                  <Link to={item.href} className="group block rounded-2xl border border-border bg-card p-7 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md">
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Icon className="text-primary" size={22} />
                    </div>
                    <h3 className="font-heading text-xl font-bold text-foreground mb-2">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">{item.text}</p>
                    <span className="inline-flex items-center gap-2 text-secondary font-semibold">
                      Découvrir <ArrowRight size={16} />
                    </span>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <WaveDivider fillColor="hsl(var(--sunlight))" />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Conseils;