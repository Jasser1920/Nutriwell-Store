import { ArrowRight } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import WaveDivider from "./WaveDivider";
import infoCard1 from "@/assets/info-card-1.jpg";
import infoCard2 from "@/assets/info-card-2.jpg";
import infoCard3 from "@/assets/info-card-3.jpg";

type InfoCardsSectionProps = {
  content?: {
    title: string;
    subtitle: string;
    cards: Array<{ title: string; image: string; linkLabel: string; linkHref: string }>;
    ctaLabel: string;
    ctaHref: string;
  };
};

const InfoCardsSection = ({ content }: InfoCardsSectionProps) => {
  const sectionContent = content ?? {
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
  };
  const ctaHref = sectionContent.ctaHref && sectionContent.ctaHref !== "#" ? sectionContent.ctaHref : "/conseils";

  return (
    <section id="info" className="relative py-28 bg-background overflow-hidden">
      {/* Biophilic leaf accent */}
      <div className="absolute top-20 right-[4%] w-24 h-24 opacity-[0.04] animate-gentle-sway pointer-events-none">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 5C50 5 15 30 15 60C15 80 30 95 50 95C70 95 85 80 85 60C85 30 50 5 50 5Z" stroke="hsl(147 100% 37%)" strokeWidth="1.5"/>
          <path d="M50 20V85" stroke="hsl(147 100% 37%)" strokeWidth="1"/>
        </svg>
      </div>

      <div className="container mx-auto px-6">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              {sectionContent.title}
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {sectionContent.subtitle}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {sectionContent.cards.map((card, i) => (
            <ScrollReveal key={card.title} delay={i * 0.15}>
              <div className="group organic-card overflow-hidden">
                <div className="aspect-[5/4] overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    width={640}
                    height={512}
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-heading text-lg font-bold mb-3 text-foreground">
                    {card.title}
                  </h3>
                  <a
                    href={card.linkHref}
                    className="inline-flex items-center gap-1.5 text-secondary font-semibold text-sm hover:gap-3 transition-all duration-200"
                  >
                    {card.linkLabel} <ArrowRight size={16} />
                  </a>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <div className="text-center">
            <a
              href={ctaHref}
              className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-8 py-3.5 rounded-full font-semibold hover:bg-secondary/90 hover:shadow-md transition-all duration-200 text-[15px]"
            >
              {sectionContent.ctaLabel}
            </a>
          </div>
        </ScrollReveal>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <WaveDivider fillColor="hsl(var(--muted))" />
      </div>
    </section>
  );
};

export default InfoCardsSection;
