import { Check } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const tips = [
  "En collation entre les repas pour maintenir vos apports",
  "Au petit-déjeuner pour bien démarrer la journée",
  "En complément d'un repas léger pour l'enrichir",
];

const UsageBanner = () => (
  <section className="bg-accent/10 py-12 md:py-16">
    <div className="container mx-auto px-4 md:px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
        <ScrollReveal>
          <div className="rounded-2xl overflow-hidden aspect-[4/3]">
            <img
              src="https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=600&h=450&fit=crop"
              alt="Personne profitant d'une boisson nutritionnelle"
              className="w-full h-full object-cover"
            />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="space-y-5">
            <h2 className="font-heading text-xl md:text-2xl font-bold text-foreground">
              Comment intégrer Nutriwell dans votre quotidien ?
            </h2>
            <ul className="space-y-3">
              {tips.map((tip) => (
                <li key={tip} className="flex items-start gap-2">
                  <Check size={18} className="text-secondary mt-0.5 shrink-0" />
                  <span className="text-muted-foreground text-sm">{tip}</span>
                </li>
              ))}
            </ul>
            <a href="#" className="inline-block text-primary font-semibold text-sm hover:underline">
              Voir toutes nos recettes →
            </a>
          </div>
        </ScrollReveal>
      </div>
    </div>
  </section>
);

export default UsageBanner;
