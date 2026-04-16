import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Shield, Leaf, FlaskConical, Award, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WaveDivider from "@/components/WaveDivider";
import ScrollReveal from "@/components/ScrollReveal";
import aboutHero from "@/assets/about-hero.jpg";
import aboutFactory from "@/assets/about-factory.jpg";
import aboutProducts from "@/assets/about-products.jpg";
import { AboutPageContent, fetchPublicPageContent } from "@/lib/content-service";

const benefitsIcons = [Shield, Leaf, FlaskConical];

const defaultAboutContent: AboutPageContent = {
  hero: { title: "Qui Sommes-Nous", image: aboutHero },
  intro: {
    text: "Depuis plus de 20 ans, Nutriwell s'engage à offrir des solutions de nutrition médicale qui allient rigueur scientifique et douceur naturelle. Notre mission : accompagner chaque patient vers une meilleure qualité de vie grâce à des produits savoureux, équilibrés et cliniquement validés.",
  },
  positioning: {
    title: "La nutrition qui soigne",
    text1: "Nutriwell est née d'une conviction : la nutrition médicale ne doit pas sacrifier le plaisir au profit de l'efficacité. Chacune de nos formules est conçue pour répondre à des besoins cliniques précis tout en offrant une expérience gustative réconfortante.",
    text2: "Notre gamme couvre l'ensemble des besoins nutritionnels — des boissons enrichies aux compléments protéinés, en passant par des textures adaptées à chaque profil de patient.",
    text3: "Reconnue par les professionnels de santé en France et à l'international, Nutriwell est aujourd'hui une référence dans le domaine de la nutrition clinique pour les adultes de plus de 55 ans.",
    image: aboutProducts,
  },
  manufacturing: {
    title: "Fabriqué en France",
    text1: "Nos produits sont entièrement conçus et fabriqués dans notre usine en France, certifiée selon les Bonnes Pratiques de Fabrication (BPF). Chaque étape — de la sélection des matières premières au conditionnement — répond aux plus hauts standards de qualité pharmaceutique.",
    text2: "Cette maîtrise complète de la chaîne de production nous permet de garantir traçabilité, sécurité et excellence à chaque lot. Notre ancrage territorial reflète notre engagement envers une production responsable et durable.",
    image: aboutFactory,
  },
  innovation: {
    badge: "Depuis 2003",
    title: "L'innovation au cœur de notre ADN",
    text: "Notre équipe R&D, composée de nutritionnistes, pharmaciens et ingénieurs agroalimentaires, travaille en étroite collaboration avec les hôpitaux et centres de recherche. Cette synergie nous permet de développer des solutions nutritionnelles innovantes, validées cliniquement et adaptées aux besoins réels des patients. Avec plus de 80 références et 40 saveurs, Nutriwell repousse les limites de la nutrition médicale.",
  },
  quality: {
    title: "Notre engagement qualité",
    text1: "La qualité n'est pas un objectif chez Nutriwell, c'est un prérequis. De la sélection rigoureuse de chaque ingrédient à la validation finale en laboratoire, nous appliquons un contrôle qualité à chaque étape de notre processus.",
    text2: "Nos certifications ISO et BPF témoignent de cet engagement. Chaque lot est tracé, chaque formule est testée, et chaque patient mérite la garantie d'un produit sûr, efficace et agréable à consommer.",
  },
  benefits: {
    title: "Pourquoi choisir Nutriwell ?",
    items: [
      {
        title: "Qualité Certifiée",
        desc: "Chaque produit est testé et validé selon les normes pharmaceutiques les plus strictes.",
      },
      {
        title: "Ingrédients Naturels",
        desc: "Nous sélectionnons des ingrédients d'origine naturelle, sans compromis sur l'efficacité.",
      },
      {
        title: "Innovation Continue",
        desc: "Notre laboratoire R&D développe des formules à la pointe de la science nutritionnelle.",
      },
    ],
  },
};

const About = () => {
  const { data } = useQuery({
    queryKey: ["page-content", "about"],
    queryFn: () => fetchPublicPageContent("about", defaultAboutContent),
  });

  const content = data ?? defaultAboutContent;

  return (
    <div className="min-h-screen bg-background relative">
      {/* Biophilic leaf accent */}
      <div className="fixed top-40 right-4 w-20 h-20 opacity-[0.03] animate-gentle-sway pointer-events-none z-0">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 5C50 5 15 30 15 60C15 80 30 95 50 95C70 95 85 80 85 60C85 30 50 5 50 5Z" stroke="hsl(147 100% 37%)" strokeWidth="1.5"/>
          <path d="M50 20V85" stroke="hsl(147 100% 37%)" strokeWidth="1"/>
        </svg>
      </div>
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative min-h-[55vh] flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0">
          <img
            src={content.hero.image || aboutHero}
            alt="L'équipe Nutriwell réunie"
            className="w-full h-full object-cover"
            width={1920}
            height={800}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, hsla(147,100%,37%,0.5) 0%, hsla(196,100%,50%,0.5) 100%)",
            }}
          />
        </div>

        {/* Breadcrumb */}
        <div className="absolute top-24 left-6 md:left-12 z-10 text-sm text-primary-foreground/80">
          <Link to="/" className="hover:text-primary-foreground transition-colors">Accueil</Link>
          <span className="mx-2">›</span>
          <span className="text-primary-foreground font-semibold">Qui Sommes-Nous</span>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground text-center px-6"
        >
          {content.hero.title}
        </motion.h1>

        <div className="absolute bottom-0 left-0 right-0 z-10">
          <WaveDivider fillColor="hsl(0 0% 100%)" />
        </div>
      </section>

      {/* ── Intro ── */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <p className="text-center text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              {content.intro.text}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Brand Positioning ── */}
      <section className="bg-muted py-20 md:py-28 relative">
        <div className="absolute top-0 left-0 right-0 rotate-180">
          <WaveDivider fillColor="hsl(0 0% 100%)" />
        </div>
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <ScrollReveal>
              <div>
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
                  {content.positioning.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">{content.positioning.text1}</p>
                <p className="text-muted-foreground leading-relaxed mb-4">{content.positioning.text2}</p>
                <p className="text-muted-foreground leading-relaxed">{content.positioning.text3}</p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.15}>
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={content.positioning.image || aboutProducts}
                  alt="Gamme de produits Nutriwell"
                  className="w-full h-auto object-cover"
                  loading="lazy"
                  width={800}
                  height={600}
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <WaveDivider fillColor="hsl(0 0% 100%)" />
        </div>
      </section>

      {/* ── Origin / Manufacturing ── */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <ScrollReveal>
              <div className="rounded-2xl overflow-hidden shadow-lg order-2 md:order-1">
                <img
                  src={content.manufacturing.image || aboutFactory}
                  alt="Site de fabrication Nutriwell en France"
                  className="w-full h-auto object-cover"
                  loading="lazy"
                  width={800}
                  height={600}
                />
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.15}>
              <div className="order-1 md:order-2">
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
                  {content.manufacturing.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">{content.manufacturing.text1}</p>
                <p className="text-muted-foreground leading-relaxed">{content.manufacturing.text2}</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Innovation ── */}
      <section className="bg-muted py-20 md:py-28 relative">
        <div className="absolute top-0 left-0 right-0 rotate-180">
          <WaveDivider fillColor="hsl(0 0% 100%)" />
        </div>
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <ScrollReveal>
            <span className="inline-block bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-5">
              {content.innovation.badge}
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
              {content.innovation.title}
            </h2>
            <p className="text-muted-foreground leading-relaxed">{content.innovation.text}</p>
          </ScrollReveal>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <WaveDivider fillColor="hsl(0 0% 100%)" />
        </div>
      </section>

      {/* ── Quality Commitment ── */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <ScrollReveal>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
              {content.quality.title}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">{content.quality.text1}</p>
            <p className="text-muted-foreground leading-relaxed">{content.quality.text2}</p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Key Benefits ── */}
      <section className="bg-muted py-20 md:py-28 relative">
        <div className="absolute top-0 left-0 right-0 rotate-180">
          <WaveDivider fillColor="hsl(0 0% 100%)" />
        </div>
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground text-center mb-14">
              {content.benefits.title}
            </h2>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-8">
            {content.benefits.items.map((b, i) => {
              const Icon = benefitsIcons[i] ?? Shield;
              return (
              <ScrollReveal key={b.title} delay={i * 0.1}>
                <div className="organic-card p-8 text-center">
                  <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-5">
                    <Icon className="text-secondary" size={26} />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-foreground mb-3">
                    {b.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{b.desc}</p>
                </div>
              </ScrollReveal>
            );})}
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

export default About;
