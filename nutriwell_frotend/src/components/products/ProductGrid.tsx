import { Link } from "react-router-dom";
import ScrollReveal from "@/components/ScrollReveal";
import { useQuery } from "@tanstack/react-query";
import { fetchProductCards } from "@/lib/product-service";

interface Props {
  activeFilter: string;
  activeTexture: string;
  activeGout: string;
  activeRegime: string;
}

const ProductGrid = ({ activeTexture, activeGout, activeRegime }: Props) => {
  const { data: filtered = [], isLoading, isError } = useQuery({
    queryKey: ["products-grid", activeTexture, activeGout, activeRegime],
    queryFn: () =>
      fetchProductCards({
        activeTexture,
        activeGout,
        activeRegime,
      }),
  });

  return (
    <section className="bg-background py-10">
      <div className="container mx-auto px-8 lg:px-12">
        {isLoading && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">Chargement des produits...</p>
          </div>
        )}
        {isError && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">Impossible de charger les produits pour le moment.</p>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
          {filtered.map((product, i) => (
            <ScrollReveal key={product.name} delay={Math.min(i * 0.04, 0.25)} style={{ height: '400px', flexGrow: 0 }}>
              <Link to={`/products/${product.slug}`}>
                <div className="group bg-card border border-dashed shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer p-5 flex flex-col h-full min-h-[320px]" style={{ borderColor: 'rgba(255, 255, 255, 1)', borderTopLeftRadius: '120px', borderTopRightRadius: '0px', borderBottomRightRadius: '120px', borderBottomLeftRadius: '0px' }}>
                  <div className="relative flex items-center justify-center aspect-[5/7] mb-4 overflow-hidden flex-1 w-full" style={{ backgroundColor: '#F3F4F6', borderTopLeftRadius: '120px', borderTopRightRadius: '0px', borderBottomRightRadius: '120px', borderBottomLeftRadius: '0px' }}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-auto max-h-full object-contain"
                      style={{ border: '1px solid rgb(224, 235, 231)', maxWidth: '100%' }}
                      loading="lazy"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] text-muted-foreground" style={{ fontSize: '14px', fontWeight: '600' }}>{product.flavors}</p>
                    <h3 className="font-heading font-semibold text-foreground text-[20px] group-hover:text-primary transition-colors leading-snug">
                      {product.name}
                    </h3>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">Aucun produit ne correspond à vos filtres.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
