import { Search, Leaf, Flag } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const items = [
  { icon: Search, title: "80 produits et 40 saveurs", desc: "Pour toujours avoir le choix" },
  { icon: Leaf, title: "Réalisés par des experts", desc: "En nutrition médicale" },
  { icon: Flag, title: "Fabriqués en France", desc: "Qualité et traçabilité garanties" },
];

const CredibilityBar = () => (
  <section className="bg-background py-16">
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {items.map((item, i) => (
          <ScrollReveal key={item.title} delay={i * 0.1}>
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <item.icon size={24} className="text-primary" />
              </div>
              <h3 className="font-heading font-bold text-foreground mb-2">{item.title}</h3>
              <p className="text-muted-foreground text-sm">{item.desc}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
);

export default CredibilityBar;
