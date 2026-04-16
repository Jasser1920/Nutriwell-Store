import ScrollReveal from "./ScrollReveal";
import NutriwellLogo from "./NutriwellLogo";

const footerLinks = ["Nos Produits", "Qui Sommes-Nous", "Nos Recettes et Astuces", "Contact"];

const Footer = () => {
  return (
    <footer className="relative bg-brand-dark text-primary-foreground py-20 overflow-hidden">
      {/* Biophilic leaf accents */}
      <div className="absolute top-12 left-[6%] w-32 h-32 opacity-[0.04] animate-gentle-sway pointer-events-none">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 5C50 5 15 30 15 60C15 80 30 95 50 95C70 95 85 80 85 60C85 30 50 5 50 5Z" stroke="hsl(167 82% 55%)" strokeWidth="1.5"/>
          <path d="M50 20V85" stroke="hsl(167 82% 55%)" strokeWidth="1"/>
          <path d="M50 40C40 35 25 40 25 55" stroke="hsl(167 82% 55%)" strokeWidth="0.8"/>
        </svg>
      </div>
      <div className="absolute bottom-8 right-[8%] w-24 h-24 opacity-[0.04] animate-gentle-sway pointer-events-none" style={{ animationDelay: '2s' }}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 5C50 5 15 30 15 60C15 80 30 95 50 95C70 95 85 80 85 60C85 30 50 5 50 5Z" stroke="hsl(147 100% 37%)" strokeWidth="1.5"/>
        </svg>
      </div>

      {/* Decorative organic circles */}
      <div className="decorative-dot w-40 h-40 bg-secondary/10 -bottom-10 -right-10" />
      <div className="decorative-dot w-24 h-24 bg-primary/10 top-16 left-[10%]" />

      <div className="container mx-auto px-6">
        <ScrollReveal>
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <NutriwellLogo variant="white" />
            </div>
            <p className="text-accent text-lg max-w-md mx-auto">
              La nutrition qui soigne
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-12">
            {footerLinks.map((link) => (
              <a
                key={link}
                href="#"
                className="text-primary-foreground/60 hover:text-accent transition-all duration-200 font-medium"
              >
                {link}
              </a>
            ))}
          </nav>
        </ScrollReveal>

        <ScrollReveal delay={0.25}>
          <div className="border-t border-primary-foreground/10 pt-8 text-center">
            <p className="text-primary-foreground/40 text-sm">
              © {new Date().getFullYear()} Nutriwell™. Tous droits réservés.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </footer>
  );
};

export default Footer;
