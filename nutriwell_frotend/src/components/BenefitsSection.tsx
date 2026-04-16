import { Hospital, Leaf, FlaskConical } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import WaveDivider from "./WaveDivider";

const benefits = [
  {
    icon: Hospital,
    title: "Formules validées médicalement",
    description: "Chaque produit est développé en collaboration avec des professionnels de santé et validé cliniquement.",
  },
  {
    icon: Leaf,
    title: "Ingrédients naturels de qualité",
    description: "Nous sélectionnons des ingrédients naturels et de haute qualité pour une nutrition optimale.",
  },
  {
    icon: FlaskConical,
    title: "Fabriqué selon les normes pharmaceutiques",
    description: "Nos produits respectent les standards les plus stricts de fabrication pharmaceutique.",
  },
];

type BenefitsSectionProps = {
  content?: {
    title: string;
    items: Array<{ title: string; description: string }>;
  };
};

const BenefitsSection = ({ content }: BenefitsSectionProps) => {
  const sectionContent = content ?? {
    title: "Pourquoi choisir Nutriwell ?",
    items: benefits.map((benefit) => ({ title: benefit.title, description: benefit.description })),
  };

  return (
    <section id="benefits" className="relative py-28 bg-background overflow-hidden">
      {/* Biophilic leaf accents */}
      <div className="absolute top-12 left-[15%] w-28 h-28 opacity-[0.04] animate-gentle-sway pointer-events-none">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 5C50 5 15 30 15 60C15 80 30 95 50 95C70 95 85 80 85 60C85 30 50 5 50 5Z" stroke="hsl(147 100% 37%)" strokeWidth="1.5"/>
          <path d="M50 20V85" stroke="hsl(147 100% 37%)" strokeWidth="1"/>
          <path d="M50 40C40 35 25 40 25 55" stroke="hsl(147 100% 37%)" strokeWidth="0.8"/>
          <path d="M50 55C60 50 75 52 75 62" stroke="hsl(147 100% 37%)" strokeWidth="0.8"/>
        </svg>
      </div>
      <div className="absolute bottom-16 right-[8%] w-20 h-20 opacity-[0.04] animate-gentle-sway pointer-events-none" style={{ animationDelay: '3s' }}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 5C50 5 15 30 15 60C15 80 30 95 50 95C70 95 85 80 85 60C85 30 50 5 50 5Z" stroke="hsl(196 100% 50%)" strokeWidth="1.5"/>
        </svg>
      </div>

      {/* Decorative organic circles */}
      <div className="decorative-dot w-32 h-32 bg-secondary -top-8 left-[20%]" />
      <div className="decorative-dot w-20 h-20 bg-primary top-1/3 right-[5%]" />
      <div className="decorative-dot w-16 h-16 bg-accent bottom-10 left-[8%]" />

      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-10">
          {sectionContent.items.map((item, i) => {
            const benefit = benefits[i % benefits.length];
            return (
            <ScrollReveal key={`${item.title}-${i}`} delay={i * 0.15}>
              <div className="text-center organic-card p-8 rounded-2xl">
                <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-6">
                  <benefit.icon className="text-secondary" size={32} />
                </div>
                <h3 className="font-heading text-xl font-bold text-foreground mb-3">
                  {item.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </ScrollReveal>
            );
          })}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <WaveDivider fillColor="hsl(160 40% 5%)" />
      </div>
    </section>
  );
};

export default BenefitsSection;
