import ScrollReveal from "./ScrollReveal";
import WaveDivider from "./WaveDivider";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProductCards } from "@/lib/product-service";

type ProductHighlightProps = {
  content?: {
    title: string;
    subtitle: string;
    ctaLabel: string;
    ctaHref: string;
  };
};

const ProductHighlight = ({ content }: ProductHighlightProps) => {
  const sectionContent = content ?? {
    title: "Une gamme pensée pour chaque besoin",
    subtitle: "Découvrez nos produits publiés depuis votre dashboard admin.",
    ctaLabel: "Voir tous les produits",
    ctaHref: "/products",
  };

  const { data: products = [], isLoading, isError } = useQuery({
    queryKey: ["home-products"],
    queryFn: () =>
      fetchProductCards({
        activeTexture: "",
        activeGout: "",
        activeRegime: "",
      }),
  });

  const featured = products.slice(0, 3);

  return (
    <section id="products" className="relative bg-muted py-28 overflow-hidden">
      {/* Biophilic leaf accent */}
      <div className="absolute top-16 right-[12%] w-28 h-28 opacity-[0.04] animate-gentle-sway pointer-events-none">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 5C50 5 15 30 15 60C15 80 30 95 50 95C70 95 85 80 85 60C85 30 50 5 50 5Z" stroke="hsl(147 100% 37%)" strokeWidth="1.5"/>
          <path d="M50 20V85" stroke="hsl(147 100% 37%)" strokeWidth="1"/>
          <path d="M50 40C40 35 25 40 25 55" stroke="hsl(147 100% 37%)" strokeWidth="0.8"/>
        </svg>
      </div>

      {/* Organic decorative circles */}
      <div className="decorative-dot w-40 h-40 bg-accent top-10 right-[10%]" />
      <div className="decorative-dot w-24 h-24 bg-accent bottom-20 left-[5%]" />

      <div className="container mx-auto px-6">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              {sectionContent.title}
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {sectionContent.subtitle}
            </p>
          </div>
        </ScrollReveal>

        {isLoading && <p className="text-center text-muted-foreground">Chargement des produits...</p>}
        {isError && <p className="text-center text-muted-foreground">Impossible de charger les produits.</p>}

        {!isLoading && !isError && (
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {featured.map((product, i) => (
              <ScrollReveal key={product.slug} delay={i * 0.08}>
                <Link to={`/products/${product.slug}`} className="group block organic-card overflow-hidden">
                  <div className="aspect-[4/3] overflow-hidden bg-leaf-light">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">{product.flavors}</p>
                    <h3 className="font-heading text-lg font-bold text-foreground group-hover:text-secondary transition-colors duration-200">{product.name}</h3>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        )}

        <div className="text-center">
          <Link
            to={sectionContent.ctaHref}
            className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-8 py-3.5 rounded-full font-semibold hover:bg-secondary/90 hover:shadow-md transition-all duration-200 text-[15px]"
          >
            {sectionContent.ctaLabel}
          </Link>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <WaveDivider fillColor="hsl(var(--sunlight))" />
      </div>
    </section>
  );
};

export default ProductHighlight;
