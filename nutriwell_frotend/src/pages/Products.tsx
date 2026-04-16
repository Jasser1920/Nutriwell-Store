import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/products/Breadcrumb";
import ProductPageHeader from "@/components/products/ProductPageHeader";
import FilterBar from "@/components/products/FilterBar";
import ProductGrid from "@/components/products/ProductGrid";
import CredibilityBar from "@/components/products/CredibilityBar";
import WaveDivider from "@/components/WaveDivider";
import { useState } from "react";

const Products = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeTexture, setActiveTexture] = useState("");
  const [activeGout, setActiveGout] = useState("");
  const [activeRegime, setActiveRegime] = useState("");

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-20">
        <Breadcrumb />
        <ProductPageHeader />
        <FilterBar
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          activeTexture={activeTexture}
          setActiveTexture={setActiveTexture}
          activeGout={activeGout}
          setActiveGout={setActiveGout}
          activeRegime={activeRegime}
          setActiveRegime={setActiveRegime}
        />
        <ProductGrid
          activeFilter={activeFilter}
          activeTexture={activeTexture}
          activeGout={activeGout}
          activeRegime={activeRegime}
        />
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

export default Products;
