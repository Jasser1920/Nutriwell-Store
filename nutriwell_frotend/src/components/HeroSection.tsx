import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import WaveDivider from "./WaveDivider";
import heroImage from "@/assets/hero-couple.jpg";

type HeroSectionProps = {
  content?: {
    title: string;
    subtitle: string;
    image: string;
    ctaLabel: string;
    ctaHref: string;
  };
};

const HeroSection = ({ content }: HeroSectionProps) => {
  const heroContent = content ?? {
    title: "L'harmonie entre nutrition médicale et vitalité naturelle",
    subtitle:
      "Nutriwell, c'est l'alliance de la science médicale et de la nature fonctionnelle, traduite dans une identité visuelle douce, fiable et épurée.",
    image: heroImage,
    ctaLabel: "Découvrir nos produits",
    ctaHref: "#products",
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0">
        <img
          src={heroContent.image}
          alt={heroContent.title}
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        {/* Biophilic gradient — natural light feel */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(160deg, hsla(147,100%,37%,0.40) 0%, hsla(167,82%,55%,0.25) 40%, hsla(196,100%,50%,0.35) 100%)",
          }}
        />
      </div>

      {/* Decorative leaf accents */}
      <div className="absolute top-32 left-8 w-24 h-24 opacity-[0.07] animate-gentle-sway pointer-events-none">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 5C50 5 15 30 15 60C15 80 30 95 50 95C70 95 85 80 85 60C85 30 50 5 50 5Z" stroke="white" strokeWidth="1.5"/>
          <path d="M50 20V85" stroke="white" strokeWidth="1"/>
        </svg>
      </div>
      <div className="absolute bottom-40 right-12 w-16 h-16 opacity-[0.06] animate-gentle-sway pointer-events-none" style={{ animationDelay: '2s' }}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 5C50 5 15 30 15 60C15 80 30 95 50 95C70 95 85 80 85 60C85 30 50 5 50 5Z" stroke="white" strokeWidth="1.5"/>
        </svg>
      </div>

      <div className="relative z-10 text-center px-6 max-w-3xl">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6"
        >
          {heroContent.title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-lg md:text-xl text-primary-foreground/90 font-body max-w-xl mx-auto mb-10"
        >
          {heroContent.subtitle}
        </motion.p>

        <motion.a
          href={heroContent.ctaHref}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-8 py-3.5 rounded-full font-semibold hover:bg-secondary/90 hover:shadow-md transition-all duration-200 text-[15px]"
        >
          {heroContent.ctaLabel}
        </motion.a>
      </div>

      <motion.a
        href="#info"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-all duration-200 animate-float shadow-lg"
        aria-label="Défiler vers le bas"
      >
        <ChevronDown className="text-secondary-foreground" size={24} />
      </motion.a>

      <div className="absolute bottom-0 left-0 right-0 z-10">
        <WaveDivider fillColor="hsl(140 20% 99%)" />
      </div>
    </section>
  );
};

export default HeroSection;
