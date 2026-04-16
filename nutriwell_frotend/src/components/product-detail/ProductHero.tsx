import { useState } from "react";
import { Star, Truck, ShieldCheck, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ScrollReveal";
import type { Product } from "@/data/products";

interface Props {
  product: Product;
}

const StarRating = ({ rating, count }: { rating: number; count: number }) => (
  <div className="flex items-center gap-2">
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={16}
          className={i <= Math.floor(rating) ? "fill-secondary text-secondary" : i - 0.5 <= rating ? "fill-secondary/50 text-secondary" : "text-border"}
        />
      ))}
    </div>
    <span className="text-sm text-muted-foreground">{rating}/5 ({count} avis)</span>
  </div>
);

const ProductHero = ({ product }: Props) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedFlavor, setSelectedFlavor] = useState(0);
  const [selectedFormat, setSelectedFormat] = useState(0);

  return (
    <section className="bg-background py-8 md:py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left — Image Gallery */}
          <ScrollReveal>
            <div className="space-y-4">
              <div className="relative bg-card border border-dashed shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-200 overflow-hidden flex items-center justify-center aspect-square max-w-md mx-auto" style={{ backgroundColor: '#c8effc', borderColor: 'rgba(255, 255, 255, 1)', borderTopLeftRadius: '120px', borderTopRightRadius: '0px', borderBottomRightRadius: '120px', borderBottomLeftRadius: '0px' }}>

                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              {product.images.length > 1 && (
                <div className="flex justify-center gap-3">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`w-16 h-16 rounded-lg border-2 overflow-hidden transition-all duration-200 ${
                        selectedImage === i ? "border-primary shadow-md" : "border-border hover:border-primary/40"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </ScrollReveal>

          {/* Right — Product Info */}
          <ScrollReveal delay={0.1}>
            <div className="space-y-5">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-accent">{product.category}</span>
                <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground mt-1">{product.name}</h1>
              </div>

              <StarRating rating={product.rating} count={product.reviewCount} />

              <p className="text-muted-foreground leading-relaxed">{product.shortDescription}</p>

              {/* Flavor Selector */}
              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">Choisir un goût</label>
                <div className="flex flex-wrap gap-2">
                  {product.flavors.map((flavor, i) => (
                    <button
                      key={flavor}
                      onClick={() => setSelectedFlavor(i)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                        selectedFlavor === i
                          ? "bg-secondary text-secondary-foreground"
                          : "border border-primary text-primary hover:bg-primary/5"
                      }`}
                    >
                      {flavor}
                    </button>
                  ))}
                </div>
              </div>

              {/* Format Selector */}
              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">Format</label>
                <div className="flex flex-wrap gap-2">
                  {product.formats.map((format, i) => (
                    <button
                      key={format}
                      onClick={() => setSelectedFormat(i)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                        selectedFormat === i
                          ? "bg-secondary text-secondary-foreground"
                          : "border border-border text-foreground hover:border-primary"
                      }`}
                    >
                      {format}
                    </button>
                  ))}
                </div>
              </div>

          

              {/* CTAs */}
              <div className="flex flex-col gap-3 pt-1">
                <Button variant="outline" className="w-full rounded-full border-primary text-primary hover:bg-primary/5 text-base py-5">
                  Trouver en pharmacie
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                {[
                  { icon: ShieldCheck, label: "Qualité certifiée" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-1.5 text-muted-foreground">
                    <Icon size={16} className="text-primary" />
                    <span className="text-xs">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default ProductHero;
