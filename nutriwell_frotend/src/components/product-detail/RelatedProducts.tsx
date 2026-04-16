import { Link } from "react-router-dom";
import ScrollReveal from "@/components/ScrollReveal";
import { useQuery } from "@tanstack/react-query";
import { fetchRelatedProducts } from "@/lib/product-service";

interface Props {
  currentSlug: string;
}

const RelatedProducts = ({ currentSlug }: Props) => {
  const { data: related = [] } = useQuery({
    queryKey: ["related-products", currentSlug],
    queryFn: () => fetchRelatedProducts(currentSlug),
  });

  if (related.length === 0) return null;

  return (
    <section className="bg-background py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-6">
        <ScrollReveal>
          <h2 className="font-heading text-xl md:text-2xl font-bold text-foreground text-center mb-8">
            Vous aimerez aussi
          </h2>
        </ScrollReveal>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {related.map((product, i) => (
            <ScrollReveal key={product.slug} delay={i * 0.05}>
              <Link to={`/products/${product.slug}`}>
                <div className="group bg-card rounded-xl border border-border shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-200 overflow-hidden">
                  <div className="bg-muted/30 p-3 flex items-center justify-center aspect-[4/3]">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-lg" loading="lazy" />
                  </div>
                  <div className="px-3 py-3">
                    <p className="text-[11px] text-muted-foreground mb-0.5">{product.flavors.length} saveurs</p>
                    <h3 className="font-heading font-bold text-foreground text-sm group-hover:text-primary transition-colors leading-snug">
                      {product.name}
                    </h3>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/products" className="text-secondary font-semibold text-sm hover:underline">
            Voir toute la gamme →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RelatedProducts;
