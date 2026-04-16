import ScrollReveal from "@/components/ScrollReveal";

const ProductPageHeader = () => (
  <section className="bg-background py-20 md:py-28">
    <div className="container mx-auto px-6 text-center">
      <ScrollReveal>
        <div className="flex justify-center gap-2 mb-6">
          <span className="w-3 h-3 rounded-full bg-primary" />
          <span className="w-3 h-3 rounded-full bg-secondary" />
          <span className="w-3 h-3 rounded-full bg-accent" />
        </div>
        <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 max-w-3xl mx-auto leading-tight">
          Nutriwell, la gamme qui prend{" "}
          <span className="text-primary">soin</span> de vous
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          Découvrez notre gamme complète de produits de nutrition médicale, conçue avec soin pour répondre à chaque besoin nutritionnel spécifique.
        </p>
        <div className="mt-8 w-16 h-1 rounded-full bg-gradient-to-r from-secondary to-primary mx-auto" />
      </ScrollReveal>
    </div>
  </section>
);

export default ProductPageHeader;
