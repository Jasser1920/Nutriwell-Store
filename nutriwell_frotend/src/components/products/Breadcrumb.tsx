import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const Breadcrumb = () => (
  <div className="bg-muted/50 py-3">
    <div className="container mx-auto px-6">
      <nav className="flex items-center gap-2 text-sm">
        <Link to="/" className="text-secondary hover:text-secondary/80 transition-colors font-medium">
          Accueil
        </Link>
        <ChevronRight size={14} className="text-muted-foreground" />
        <span className="text-foreground font-semibold">Nos Produits</span>
      </nav>
    </div>
  </div>
);

export default Breadcrumb;
