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
  priceTtc?: number;
}

export const products: Product[] = [
  {
    slug: "futurefuel-breakfast-pro-cafe",
    name: "FUTUREFUEL BREAKFAST PRO POUDRE PETIT DEJEUNER CAFE 400MG",
    category: "Énergie - Vitalité",
    flavors: ["Café"],
    formats: ["Boîte 400g"],
    badge: "TOP VENTE",
    badgeColor: "bg-secondary text-secondary-foreground",
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=600&h=600&fit=crop",
    ],
    rating: 4.8,
    reviewCount: 34,
    shortDescription: "Poudre pour petit déjeuner hyperénergétique goût café, formule enrichie pour démarrer la journée avec vitalité.",
    description: [
      "FutureFuel Breakfast Pro est spécialement conçu pour apporter une énergie durable dès le matin.",
      "Sa formule complète associe protéines de haute valeur biologique, glucides complexes et minéraux essentiels pour lutter contre la fatigue matinale.",
    ],
    benefits: [
      "Formule enrichie goût café stimulant",
      "Maintien de la vitalité et de l'énergie",
      "Facile et rapide à préparer au petit-déjeuner",
    ],
    ingredients: [
      "Protéines de lait, Extrait de café soluble, Vitamines (B1, B2, B6, C), Minéraux (Calcium, Magnésium, Fer), Edulcorant naturel.",
    ],
    importantNotice: [
      "À consommer dans le cadre d'une alimentation variée et équilibrée.",
      "Ne pas dépasser la dose journalière recommandée.",
    ],
    nutrition: [
      { nutriment: "Énergie", per100ml: "380 kcal", perPortion: "152 kcal" },
      { nutriment: "Protéines", per100ml: "45 g", perPortion: "18 g" },
      { nutriment: "Glucides", per100ml: "35 g", perPortion: "14 g" },
      { nutriment: "Lipides", per100ml: "4.5 g", perPortion: "1.8 g" },
    ],
    usageTips: [
      { icon: "clock", text: "Mélanger 40g de poudre dans 200ml de lait ou d'eau chaque matin." },
    ],
    reviews: [
      { name: "Sami K.", rating: 5, text: "Excellent goût café, parfait pour bien commencer la journée !", date: "2026-03-12" },
    ],
    texture: "Poudre",
    gout: "Café",
    regime: "Standard",
    priceTtc: 49.000,
  },
  {
    slug: "nutriwell-pro-poudre-de-proteines",
    name: "NUTRIWELL PRO POUDRE DE PROTEINES 400MG",
    category: "Énergie - Vitalité",
    flavors: ["Neutre", "Vanille"],
    formats: ["Boîte 400g"],
    badge: "HAUTE QUALITÉ",
    badgeColor: "bg-primary text-primary-foreground",
    image: "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=600&h=600&fit=crop",
    ],
    rating: 4.9,
    reviewCount: 52,
    shortDescription: "Poudre de protéines hautement assimilable pour le maintien et le renforcement de la masse musculaire et la vitalité.",
    description: [
      "Nutriwell Pro offre un apport élevé en protéines pures à haute valeur biologique.",
      "Particulièrement recommandé chez le senior, le sportif ou lors de périodes de convalescence.",
    ],
    benefits: [
      "Apport protéique concentré et hautement digestible",
      "Solubilité rapide dans boissons et préparations",
      "Renforce la masse et la fonction musculaire",
    ],
    ingredients: [
      "Isolat et concentrat de protéines de lactosérum (lait), Emulsifiant (Lécithine de tournesol).",
    ],
    importantNotice: [
      "Déconseillé en cas d'insuffisance rénale sévère sans avis médical.",
    ],
    nutrition: [
      { nutriment: "Énergie", per100ml: "370 kcal", perPortion: "148 kcal" },
      { nutriment: "Protéines", per100ml: "85 g", perPortion: "34 g" },
      { nutriment: "Glucides", per100ml: "2 g", perPortion: "0.8 g" },
      { nutriment: "Lipides", per100ml: "1.5 g", perPortion: "0.6 g" },
    ],
    usageTips: [
      { icon: "info", text: "Ajouter 1 à 2 cuillères doses dans vos potages, purées ou boissons." },
    ],
    reviews: [
      { name: "Amel B.", rating: 5, text: "Très bonne dissolution et neutre en goût.", date: "2026-02-28" },
    ],
    texture: "Poudre",
    gout: "Neutre",
    regime: "Hyperprotéiné",
    priceTtc: 65.000,
  },
  {
    slug: "nutriwell-growth-kids-chocolat",
    name: "NUTRIWELL GROWTH KIDS POUDRE ENERGETIQUE CHOCOLAT 400MG",
    category: "Énergie - Vitalité",
    flavors: ["Chocolat"],
    formats: ["Boîte 400g"],
    badge: "KIDS",
    badgeColor: "bg-accent text-accent-foreground",
    image: "https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=600&h=600&fit=crop",
    ],
    rating: 4.7,
    reviewCount: 29,
    shortDescription: "Poudre énergétique spécialement formulée pour la croissance des enfants, goût chocolat gourmand.",
    description: [
      "Formule pédiatrique équilibrée combinant Calcium, Vitamine D et protéines adaptées à la croissance infantile.",
    ],
    benefits: [
      "Goût chocolat gourmand très apprécié des enfants",
      "Favorise le développement osseux et musculaire",
      "Formule enrichie en Fer et Vitamines",
    ],
    ingredients: [
      "Cacao en poudre, Protéines de lait, Maltodextrine, Carbonate de calcium, Vitamine D3, Vitamine C, Pyrophosphate de fer.",
    ],
    importantNotice: [
      "Convient aux enfants à partir de 3 ans.",
    ],
    nutrition: [
      { nutriment: "Énergie", per100ml: "390 kcal", perPortion: "156 kcal" },
      { nutriment: "Protéines", per100ml: "25 g", perPortion: "10 g" },
      { nutriment: "Glucides", per100ml: "55 g", perPortion: "22 g" },
    ],
    usageTips: [
      { icon: "clock", text: "Diluer 3 cuillères dans un verre de lait tiède ou froid au goûter." },
    ],
    reviews: [
      { name: "Nadia M.", rating: 5, text: "Mon fils l'adore pour le petit déjeuner !", date: "2026-03-01" },
    ],
    texture: "Poudre",
    gout: "Chocolat",
    regime: "Standard",
    priceTtc: 48.000,
  },
  {
    slug: "nutriwell-calorix-poudre-enrichissement",
    name: "NUTRIWELL CALORIX POUDRE D ENRICHISSEMENT 400MG",
    category: "Prise Du Poids",
    flavors: ["Neutre"],
    formats: ["Boîte 400g"],
    badge: "PRISE DE POIDS",
    badgeColor: "bg-amber-600 text-white",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&h=600&fit=crop",
    ],
    rating: 4.6,
    reviewCount: 18,
    shortDescription: "Poudre d'enrichissement calorique pour favoriser la prise de poids saine et l'apport nutritionnel.",
    description: [
      "Nutriwell Calorix permet d'augmenter la densité énergétique des repas sans en modifier le volume ni la texture.",
    ],
    benefits: [
      "Permet une prise de poids progressive et encadrée",
      "Goût neutre, n'altère pas la saveur des plats",
      "Haute tolérance digestive",
    ],
    ingredients: [
      "Maltodextrines de maïs purifiées, Triglycérides à chaîne moyenne (TCM).",
    ],
    importantNotice: [
      "À utiliser sous contrôle médical en cas de dénutrition importante.",
    ],
    nutrition: [
      { nutriment: "Énergie", per100ml: "395 kcal", perPortion: "158 kcal" },
      { nutriment: "Glucides", per100ml: "96 g", perPortion: "38.4 g" },
    ],
    usageTips: [
      { icon: "info", text: "Saupoudrer dans les plats chauds ou froids au cours des repas." },
    ],
    reviews: [
      { name: "Karim T.", rating: 4, text: "Efficace pour reprendre du poids après convalescence.", date: "2026-01-15" },
    ],
    texture: "Poudre",
    gout: "Neutre",
    regime: "Hypercalorique",
    priceTtc: 26.000,
  },
  {
    slug: "futurefuel-poudre-proteinee-chocolat",
    name: "FUTUREFUEL POUDRE PROTEINEE CHOCOLAT 400MG",
    category: "Énergie - Vitalité",
    flavors: ["Chocolat"],
    formats: ["Boîte 400g"],
    badge: "ENERGIE",
    badgeColor: "bg-primary text-primary-foreground",
    image: "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=600&h=600&fit=crop",
    ],
    rating: 4.7,
    reviewCount: 41,
    shortDescription: "Poudre protéinée gourmande goût chocolat, riche en acides aminés essentiels pour l'énergie quotidienne.",
    description: [
      "FutureFuel Chocolat combine le plaisir d'un chocolat chaud ou froid avec l'efficacité d'un apport protéique haute performance.",
    ],
    benefits: [
      "Riche en acides aminés et BCAA",
      "Améliore la récupération et l'endurance",
      "Délicieux goût chocolat fondant",
    ],
    ingredients: [
      "Protéines de lactosérum, Cacao maigre en poudre, Arômes naturels, Complexe vitaminique B.",
    ],
    importantNotice: [
      "Conserver au sec et à l'abri de la chaleur.",
    ],
    nutrition: [
      { nutriment: "Énergie", per100ml: "375 kcal", perPortion: "150 kcal" },
      { nutriment: "Protéines", per100ml: "70 g", perPortion: "28 g" },
    ],
    usageTips: [
      { icon: "clock", text: "Prendre 1 shaker après l'effort ou en collation de l'après-midi." },
    ],
    reviews: [
      { name: "Mehdi R.", rating: 5, text: "Le goût chocolat est vraiment top !", date: "2026-02-10" },
    ],
    texture: "Poudre",
    gout: "Chocolat",
    regime: "Hyperprotéiné",
    priceTtc: 46.000,
  },
  {
    slug: "nutriwell-energie-plus-fraise",
    name: "NUTRIWELL ENERGIE+ POUDRE DE PROTEINES AROME FRAISE 400MG",
    category: "Énergie - Vitalité",
    flavors: ["Fraise"],
    formats: ["Boîte 400g"],
    badge: "FRUITÉ",
    badgeColor: "bg-rose-500 text-white",
    image: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=600&h=600&fit=crop",
    ],
    rating: 4.8,
    reviewCount: 38,
    shortDescription: "Poudre de protéines délicieusement parfumée à la fraise pour booster l'énergie et la récupération.",
    description: [
      "Nutriwell Énergie+ Fraise apporte rafraîchissement et nutriments essentiels dans une boisson fruitée gourmande.",
    ],
    benefits: [
      "Saveur fraise intense et naturelle",
      "Apport rapide en acides aminés",
      "Riche en Vitamine C et Antioxydaants",
    ],
    ingredients: [
      "Protéines de lactosérum, Jus de fraise en poudre, Arôme naturel fraise, Vitamine C, Zinc.",
    ],
    importantNotice: [
      "Contient des dérivés du lait.",
    ],
    nutrition: [
      { nutriment: "Énergie", per100ml: "372 kcal", perPortion: "148 kcal" },
      { nutriment: "Protéines", per100ml: "68 g", perPortion: "27 g" },
    ],
    usageTips: [
      { icon: "clock", text: "Diluer dans 200ml d'eau fraîche ou de lait végétal." },
    ],
    reviews: [
      { name: "Ines G.", rating: 5, text: "Très rafraîchissant avec un bon apport en protéines.", date: "2026-03-05" },
    ],
    texture: "Poudre",
    gout: "Fruité",
    regime: "Hyperprotéiné",
    priceTtc: 49.000,
  },
  {
    slug: "nutriwell-complet-hp-vanille",
    name: "NUTRIWELL COMPLET HP POUDRE DE PROTEINES AROME VANILLE 400MG",
    category: "Carence en vitamines et minéraux",
    flavors: ["Vanille"],
    formats: ["Boîte 400g"],
    badge: "COMPLET HP",
    badgeColor: "bg-secondary text-secondary-foreground",
    image: "https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=600&h=600&fit=crop",
    ],
    rating: 4.9,
    reviewCount: 45,
    shortDescription: "Formule complète HP (Hyperprotéinée & Vitamines) arôme vanille pour combler les carences nutritionnelles.",
    description: [
      "Nutriwell Complet HP est un complément nutritionnel oral complet intégrant 13 vitamines et 10 minéraux clés.",
    ],
    benefits: [
      "Formule nutritionnelle intégrale et équilibrée",
      "Arôme vanille doux et onctueux",
      "Combats les carences et la fatigue persistante",
    ],
    ingredients: [
      "Protéines de lait, Maltodextrine, Huiles végétales, Complexe de 13 vitamines (A, B1, B2, B3, B5, B6, B8, B9, B12, C, D3, E, K1), 10 Minéraux, Arôme vanille.",
    ],
    importantNotice: [
      "Destiné aux adultes en situation de carence ou de besoin accru.",
    ],
    nutrition: [
      { nutriment: "Énergie", per100ml: "385 kcal", perPortion: "154 kcal" },
      { nutriment: "Protéines", per100ml: "65 g", perPortion: "26 g" },
      { nutriment: "Glucides", per100ml: "25 g", perPortion: "10 g" },
    ],
    usageTips: [
      { icon: "info", text: "Prendre 1 à 2 portions par jour selon les recommandations médicales." },
    ],
    reviews: [
      { name: "Hassan B.", rating: 5, text: "Très complet et digeste, goût vanille agréable.", date: "2026-02-20" },
    ],
    texture: "Poudre",
    gout: "Vanille",
    regime: "Hyperprotéiné",
    priceTtc: 55.000,
  },
];
