import { useParams, Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CredibilityBar from "@/components/products/CredibilityBar";
import ProductHero from "@/components/product-detail/ProductHero";
import ProductTabs from "@/components/product-detail/ProductTabs";
import UsageBanner from "@/components/product-detail/UsageBanner";
import RelatedProducts from "@/components/product-detail/RelatedProducts";
import WaveDivider from "@/components/WaveDivider";
import { useQuery } from "@tanstack/react-query";
import { fetchProductBySlug } from "@/lib/product-service";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading } = useQuery({
    queryKey: ["product-detail", slug],
    queryFn: () => fetchProductBySlug(slug ?? ""),
    enabled: Boolean(slug),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-24 text-center">
          <p className="text-muted-foreground text-lg">Chargement du produit...</p>
        </div>
      </div>
    );
  }

  if (!product) return <Navigate to="/products" replace />;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-20">
        {/* Breadcrumb */}
        <div className="bg-muted/50 py-3">
          <div className="container mx-auto px-4 md:px-6">
            <nav className="flex items-center gap-2 text-sm">
              <Link to="/" className="text-secondary hover:text-secondary/80 transition-colors font-medium">Accueil</Link>
              <ChevronRight size={14} className="text-muted-foreground" />
              <Link to="/products" className="text-secondary hover:text-secondary/80 transition-colors font-medium">Nos Produits</Link>
              <ChevronRight size={14} className="text-muted-foreground" />
              <span className="text-foreground font-semibold">{product.name}</span>
            </nav>
          </div>
        </div>

        <ProductHero product={product} />
        <ProductTabs product={product} />
        <UsageBanner />
        <RelatedProducts currentSlug={product.slug} />
        <WaveDivider fillColor="hsl(0 0% 100%)" />
        <div className="bg-muted py-16 md:py-20 relative">
          <div className="absolute top-0 left-0 right-0 rotate-180">
            <WaveDivider fillColor="hsl(0 0% 100%)" />
          </div>
          <CredibilityBar />
          <div className="absolute bottom-0 left-0 right-0">
            <WaveDivider fillColor="hsl(var(--brand-dark))" />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
