export interface Product {
  slug: string;
  name: string;
  category: string;
  flavors: string[];
  selectedFlavor?: string;
  formats: string[];
  badge?: string;
  badgeColor?: string;
  image: string;
  images: string[];
  rating: number;
  reviewCount: number;
  shortDescription: string;
  description: string[];
  benefits: string[];
  ingredients: string[];
  importantNotice: string[];
  nutrition: { nutriment: string; per100ml: string; perPortion: string }[];
  nutritionTable?: { headers: string[]; rows: string[][] };
  usageTips: { icon: string; text: string }[];
  reviews: { name: string; rating: number; text: string; date: string }[];
  texture: string;
  gout: string;
  regime: string;
}

export const products: Product[] = [
  {
    slug: "boisson-fruitee",
    name: "Nutriwell Boisson Fruitée",
    category: "Boisson nutritionnelle",
    flavors: ["Pêche Abricot", "Fruits Rouges", "Citron", "Pomme Verte"],
    formats: ["Pack 4 × 200ml", "Pack 12 × 200ml"],
    badge: "NOUVEAU",
    badgeColor: "bg-destructive",
    image: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&h=600&fit=crop",
    ],
    rating: 4.5,
    reviewCount: 47,
    shortDescription: "Boisson fruitée hyperprotéinée, riche en vitamines et minéraux. Idéale pour compléter les apports nutritionnels au quotidien, avec un goût frais et agréable.",
    description: [
      "Nutriwell Boisson Fruitée est une boisson nutritionnelle complète, spécialement formulée pour les personnes ayant des besoins nutritionnels accrus. Sa texture légère et son goût fruité en font un complément idéal à tout moment de la journée.",
      "Enrichie en protéines de haute qualité, vitamines et minéraux essentiels, elle contribue au maintien de la masse musculaire et au bon fonctionnement de l'organisme.",
    ],
    benefits: [
      "Hyperprotéinée : 20g de protéines par portion",
      "Sans sucres ajoutés, convient aux diabétiques",
      "Enrichie en 27 vitamines et minéraux",
      "Texture légère et rafraîchissante",
      "Sans gluten, sans lactose",
    ],
    ingredients: [
      "Eau",
      "Protéines de lait (lactosérum)",
      "Jus de fruits à base de concentré 10% (pêche, abricot, pomme, citron, etc.)",
      "Maltodextrine",
      "Minéraux (calcium, magnésium, potassium, sodium)",
      "Vitamines (C, D, E, B1, B2, B6, B12, etc.)",
      "Arômes naturels"
    ],
    importantNotice: [
      "À utiliser sous contrôle médical.",
      "Ne convient pas comme seule source de nutrition.",
      "Ne pas administrer par voie parentérale."
    ],
    nutrition: [
      { nutriment: "Énergie", per100ml: "100 kcal", perPortion: "200 kcal" },
      { nutriment: "Protéines", per100ml: "10 g", perPortion: "20 g" },
      { nutriment: "Glucides", per100ml: "12 g", perPortion: "24 g" },
      { nutriment: "Lipides", per100ml: "3,5 g", perPortion: "7 g" },
      { nutriment: "Fibres", per100ml: "1,2 g", perPortion: "2,4 g" },
      { nutriment: "Sodium", per100ml: "0,15 g", perPortion: "0,30 g" },
    ],
    usageTips: [
      { icon: "clock", text: "Consommer de préférence entre les repas ou en collation, 1 à 2 fois par jour." },
      { icon: "thermometer", text: "Se déguste frais pour un plaisir optimal. Conserver au réfrigérateur après ouverture." },
      { icon: "info", text: "Agiter avant ouverture. Ne se substitue pas à une alimentation variée et équilibrée." },
    ],
    reviews: [
      { name: "Marie", rating: 5, text: "Excellent goût fruité, très rafraîchissant. Je le prends chaque matin et ça m'aide vraiment à garder la forme.", date: "12 mars 2025" },
      { name: "Jean-Pierre", rating: 4, text: "Bon produit, facile à boire. Le format 200ml est pratique à emporter. Je recommande le goût pêche abricot.", date: "28 février 2025" },
      { name: "Françoise", rating: 5, text: "Mon médecin me l'a recommandé et je suis ravie. Les saveurs sont naturelles et agréables.", date: "15 janvier 2025" },
    ],
    texture: "Boisson",
    gout: "Fruité",
    regime: "Standard",
  },
  {
    slug: "boisson-concentree",
    name: "Nutriwell Boisson Concentrée",
    category: "Boisson nutritionnelle",
    flavors: ["Vanille", "Chocolat", "Café"],
    formats: ["Pack 4 × 125ml", "Pack 12 × 125ml"],
    image: "https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=600&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=600&h=600&fit=crop"],
    rating: 4.3,
    reviewCount: 32,
    shortDescription: "Boisson concentrée hyperprotéinée en petit format, pour un apport nutritionnel maximal en volume réduit.",
    description: ["Nutriwell Boisson Concentrée offre un apport nutritionnel complet dans un format compact de 125ml, idéal pour les personnes ayant peu d'appétit.", "Sa formule concentrée permet d'obtenir un maximum de nutriments essentiels en un minimum de volume."],
    benefits: ["Format compact 125ml facile à consommer", "300 kcal par bouteille", "Riche en protéines et énergie", "3 saveurs gourmandes"],
    ingredients: [
      "Eau",
      "Protéines de lait",
      "Cacao maigre en poudre",
      "Extrait de café",
      "Édulcorant: sucralose",
      "Arômes"
    ],
    importantNotice: [
      "À utiliser sous surveillance médicale.",
      "Ne convient pas aux enfants de moins de 3 ans.",
      "Ne pas administrer par voie parentérale."
    ],
    nutrition: [
      { nutriment: "Énergie", per100ml: "240 kcal", perPortion: "300 kcal" },
      { nutriment: "Protéines", per100ml: "10 g", perPortion: "12,5 g" },
      { nutriment: "Glucides", per100ml: "25 g", perPortion: "31 g" },
      { nutriment: "Lipides", per100ml: "11 g", perPortion: "14 g" },
      { nutriment: "Fibres", per100ml: "0 g", perPortion: "0 g" },
      { nutriment: "Sodium", per100ml: "0,12 g", perPortion: "0,15 g" },
    ],
    usageTips: [
      { icon: "clock", text: "Consommer 1 à 3 bouteilles par jour selon les recommandations de votre professionnel de santé." },
      { icon: "thermometer", text: "Servir frais ou à température ambiante." },
      { icon: "info", text: "Bien agiter avant ouverture." },
    ],
    reviews: [
      { name: "Claude", rating: 4, text: "Très pratique, le petit format est parfait quand on n'a pas faim.", date: "5 mars 2025" },
      { name: "Monique", rating: 5, text: "Le goût chocolat est délicieux !", date: "20 février 2025" },
      { name: "André", rating: 4, text: "Bien concentré, efficace.", date: "10 janvier 2025" },
    ],
    texture: "Boisson",
    gout: "Fruité",
    regime: "Hyperprotéiné",
  },
  {
    slug: "creme-dessert",
    name: "Nutriwell Crème Dessert",
    category: "Crème nutritionnelle",
    flavors: ["Vanille", "Chocolat", "Caramel", "Café", "Praliné"],
    formats: ["Pack 4 × 125g", "Pack 12 × 125g"],
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&h=600&fit=crop"],
    rating: 4.7,
    reviewCount: 63,
    shortDescription: "Crème dessert onctueuse et gourmande, enrichie en protéines. Un vrai plaisir nutritionnel.",
    description: ["Nutriwell Crème Dessert allie plaisir gustatif et nutrition médicale dans une texture onctueuse et réconfortante.", "Disponible en 5 saveurs gourmandes pour varier les plaisirs au quotidien."],
    benefits: ["Texture onctueuse et gourmande", "5 saveurs disponibles", "Enrichie en protéines", "Prête à consommer"],
    ingredients: [
      "Lait écrémé",
      "Protéines de lait",
      "Sucre",
      "Cacao maigre en poudre",
      "Arômes naturels",
      "Épaississant: amidon modifié",
      "Édulcorant: sucralose"
    ],
    importantNotice: [
      "À utiliser sous contrôle médical uniquement.",
      "Ne convient pas comme seule source de nutrition.",
      "Ne pas administrer par voie parentérale."
    ],
    nutrition: [
      { nutriment: "Énergie", per100ml: "150 kcal", perPortion: "188 kcal" },
      { nutriment: "Protéines", per100ml: "8 g", perPortion: "10 g" },
      { nutriment: "Glucides", per100ml: "18 g", perPortion: "22,5 g" },
      { nutriment: "Lipides", per100ml: "5 g", perPortion: "6,3 g" },
      { nutriment: "Fibres", per100ml: "0,5 g", perPortion: "0,6 g" },
      { nutriment: "Sodium", per100ml: "0,10 g", perPortion: "0,13 g" },
    ],
    usageTips: [
      { icon: "clock", text: "Idéale en dessert ou en collation, 1 à 2 pots par jour." },
      { icon: "thermometer", text: "Se déguste fraîche. Conserver au réfrigérateur." },
      { icon: "info", text: "Ne pas réchauffer." },
    ],
    reviews: [
      { name: "Simone", rating: 5, text: "Un vrai régal, le goût caramel est mon préféré !", date: "8 mars 2025" },
      { name: "Robert", rating: 5, text: "Enfin un produit médical qui a bon goût.", date: "25 février 2025" },
      { name: "Hélène", rating: 4, text: "Très bon, je le recommande à tous.", date: "3 février 2025" },
    ],
    texture: "Crème",
    gout: "Vanille",
    regime: "Standard",
  },
];

export const getProductBySlug = (slug: string) => products.find((p) => p.slug === slug);

export const getRelatedProducts = (currentSlug: string) =>
  products.filter((p) => p.slug !== currentSlug).slice(0, 4);

// Map from ProductGrid names to slugs
export const nameToSlug: Record<string, string> = {
  "Nutriwell Boisson Fruitée": "boisson-fruitee",
  "Nutriwell Boisson Concentrée": "boisson-concentree",
  "Nutriwell Crème Dessert": "creme-dessert",
  "Nutriwell Boisson Lactée": "boisson-fruitee",
  "Nutriwell Les Veloutés": "boisson-fruitee",
  "Nutriwell Les Purées": "boisson-fruitee",
  "Nutriwell Nutra Cake": "boisson-fruitee",
  "Nutriwell Crème Sans Sucre": "creme-dessert",
  "Nutriwell Boisson Sans Sucre": "boisson-fruitee",
  "Nutriwell Nutra Pâte": "boisson-fruitee",
  "Nutriwell Riz au Lait": "creme-dessert",
  "Nutriwell Céréales Instant": "boisson-fruitee",
  "Nutriwell Poudre de Protéines": "boisson-concentree",
  "Nutriwell Renal Instant": "boisson-concentree",
  "Nutriwell Gelée Fruitée": "boisson-fruitee",
  "Nutriwell Gelée Édulcorée": "boisson-fruitee",
  "Nutriwell Poudre Épaississante": "boisson-concentree",
  "Nutriwell Délice de Fruits": "boisson-fruitee",
};
