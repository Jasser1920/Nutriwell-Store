import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import aboutHero from "@/assets/about-hero.jpg";
import aboutFactory from "@/assets/about-factory.jpg";
import aboutProducts from "@/assets/about-products.jpg";
import heroImage from "@/assets/hero-couple.jpg";
import infoCard1 from "@/assets/info-card-1.jpg";
import infoCard2 from "@/assets/info-card-2.jpg";
import infoCard3 from "@/assets/info-card-3.jpg";
import recipesHero from "@/assets/recipes-hero.jpg";
import { signOut } from "@/lib/admin-service";
import {
  AboutPageContent,
  ConseilsPageContent,
  HomePageContent,
  PageContentMap,
  RecipesPageContent,
  fetchAdminPageContent,
  uploadPageContentImage,
  saveAdminPageContent,
} from "@/lib/content-service";

const defaultAboutContent: AboutPageContent = {
  hero: { title: "Qui Sommes-Nous", image: aboutHero },
  intro: {
    text: "Depuis plus de 20 ans, Nutriwell s'engage à offrir des solutions de nutrition médicale qui allient rigueur scientifique et douceur naturelle.",
  },
  positioning: {
    title: "La nutrition qui soigne",
    text1: "Nutriwell est née d'une conviction : la nutrition médicale ne doit pas sacrifier le plaisir au profit de l'efficacité.",
    text2: "Notre gamme couvre l'ensemble des besoins nutritionnels pour différents profils de patients.",
    text3: "Reconnue par les professionnels de santé, Nutriwell est une référence en nutrition clinique.",
    image: aboutProducts,
  },
  manufacturing: {
    title: "Fabriqué en France",
    text1: "Nos produits sont conçus et fabriqués en France selon les standards de qualité pharmaceutique.",
    text2: "Cette maîtrise garantit traçabilité, sécurité et excellence à chaque lot.",
    image: aboutFactory,
  },
  innovation: {
    badge: "Depuis 2003",
    title: "L'innovation au cœur de notre ADN",
    text: "Notre équipe R&D développe des solutions nutritionnelles cliniquement validées et adaptées aux besoins réels des patients.",
  },
  quality: {
    title: "Notre engagement qualité",
    text1: "La qualité est un prérequis chez Nutriwell, du choix des ingrédients jusqu'à la validation finale.",
    text2: "Chaque lot est tracé et chaque formule est testée pour garantir des produits sûrs et efficaces.",
  },
  benefits: {
    title: "Pourquoi choisir Nutriwell ?",
    items: [
      { title: "Qualité Certifiée", desc: "Produits testés et validés selon des normes strictes." },
      { title: "Ingrédients Naturels", desc: "Sélection rigoureuse d'ingrédients d'origine naturelle." },
      { title: "Innovation Continue", desc: "Formules à la pointe de la science nutritionnelle." },
    ],
  },
};

const defaultRecipesContent: RecipesPageContent = {
  hero: {
    title: "Nos Recettes et Astuces",
    subtitle: "Des idées gourmandes et nutritives pour prendre soin de vous au quotidien.",
    image: recipesHero,
  },
  benefitsStrip: [
    { text: "Recettes validées par nos nutritionnistes" },
    { text: "Préparation rapide, moins de 30 min" },
    { text: "Adaptées aux besoins des seniors" },
  ],
  promos: [
    { title: "Boostez vos recettes", desc: "Ajoutez Nutriwell Boisson Fruitée à vos smoothies.", cta: "En savoir plus →" },
    { title: "Astuce bien-être", desc: "Un petit-déjeuner riche en protéines aide à garder l'énergie.", cta: "En savoir plus →" },
    { title: "Le saviez-vous ?", desc: "Les fibres alimentaires favorisent une digestion saine.", cta: "En savoir plus →" },
  ],
};

const defaultHomeContent: HomePageContent = {
  hero: {
    title: "L'harmonie entre nutrition médicale et vitalité naturelle",
    subtitle:
      "Nutriwell, c'est l'alliance de la science médicale et de la nature fonctionnelle, traduite dans une identité visuelle douce, fiable et épurée.",
    image: heroImage,
    ctaLabel: "Découvrir nos produits",
    ctaHref: "/conseils",
  },
  infoCards: {
    title: "Votre parcours bien-être commence ici",
    subtitle:
      "Découvrez des conseils validés par des experts pour vous sentir au meilleur de votre forme — de l'activité physique à l'alimentation.",
    cards: [
      { title: "Bien vieillir au quotidien", image: infoCard1, linkLabel: "En savoir plus", linkHref: "#" },
      { title: "Nutrition simplifiée", image: infoCard2, linkLabel: "En savoir plus", linkHref: "#" },
      { title: "Le plaisir dans chaque repas", image: infoCard3, linkLabel: "En savoir plus", linkHref: "#" },
    ],
    ctaLabel: "Découvrir nos conseils",
    ctaHref: "/conseils",
  },
  products: {
    title: "Une gamme pensée pour chaque besoin",
    subtitle: "Découvrez nos produits publiés depuis votre dashboard admin.",
    ctaLabel: "Voir tous les produits",
    ctaHref: "/products",
  },
  recipes: {
    title: "Des idées pour enrichir votre alimentation",
    subtitle:
      "Des recettes simples et savoureuses réalisées avec les produits Nutriwell. Nourrissez votre corps avec des repas que vous aimerez vraiment.",
    ctaLabel: "Explorer toutes les recettes",
    ctaHref: "/recipes",
  },
  benefits: {
    title: "Pourquoi choisir Nutriwell ?",
    items: [
      {
        title: "Formules validées médicalement",
        description:
          "Chaque produit est développé en collaboration avec des professionnels de santé et validé cliniquement.",
      },
      {
        title: "Ingrédients naturels de qualité",
        description: "Nous sélectionnons des ingrédients naturels et de haute qualité pour une nutrition optimale.",
      },
      {
        title: "Fabriqué selon les normes pharmaceutiques",
        description: "Nos produits respectent les standards les plus stricts de fabrication pharmaceutique.",
      },
    ],
  },
};

const defaultConseilsContent: ConseilsPageContent = {
  hero: {
    title: "Découvrir nos conseils",
    subtitle:
      "Des repères simples et utiles pour mieux accompagner la nutrition au quotidien, avec des gestes concrets, des idées de repas et des habitudes faciles à suivre.",
    image: heroImage,
    ctaLabel: "Voir les recettes",
    ctaHref: "/recipes",
  },
  intro: {
    badge: "Conseils pratiques",
    title: "Des repères simples, alignés avec l'esprit Nutriwell",
    text: "Une page pensée pour les visiteurs qui veulent agir concrètement, sans jargon, avec des conseils clairs et applicables.",
  },
  adviceCards: [
    { icon: "Stethoscope", title: "Parlez d'abord à un professionnel de santé", text: "Chaque profil est différent. Un conseil bien ciblé commence par une bonne évaluation des besoins, des contraintes et du contexte médical." },
    { icon: "Heart", title: "Choisissez la régularité avant la perfection", text: "De petits gestes répétés chaque jour sont souvent plus efficaces qu'un changement radical difficile à tenir dans le temps." },
    { icon: "Leaf", title: "Composez des repas simples et rassurants", text: "Miser sur des ingrédients familiers, une texture agréable et des portions adaptées aide à garder l'envie de manger." },
    { icon: "SunMedium", title: "Soutenez l'énergie sur toute la journée", text: "Répartir les apports entre repas et collations peut aider à maintenir confort, énergie et plaisir alimentaire." },
  ],
  quickLinks: [
    { title: "Explorer les recettes", text: "Des idées concrètes pour cuisiner avec les produits Nutriwell.", href: "/recipes" },
    { title: "Découvrir les produits", text: "Trouvez la formule adaptée au besoin nutritionnel recherché.", href: "/products" },
  ],
};

type PageKey = keyof PageContentMap;

type FieldDef = {
  label: string;
  path: string[];
  type: "text" | "textarea" | "image";
};

type SectionDef = {
  id: string;
  title: string;
  subtitle: string;
  fields: FieldDef[];
};

const pageConfigs: Record<PageKey, { title: string; defaults: PageContentMap[PageKey]; sections: SectionDef[] }> = {
  home: {
    title: "Page Home",
    defaults: defaultHomeContent,
    sections: [
      {
        id: "hero",
        title: "Hero",
        subtitle: "Bannière principale",
        fields: [
          { label: "Titre", path: ["hero", "title"], type: "text" },
          { label: "Sous-titre", path: ["hero", "subtitle"], type: "textarea" },
          { label: "Image hero (URL)", path: ["hero", "image"], type: "image" },
          { label: "Bouton texte", path: ["hero", "ctaLabel"], type: "text" },
          { label: "Bouton lien", path: ["hero", "ctaHref"], type: "text" },
        ],
      },
      {
        id: "infoCards",
        title: "Cartes infos",
        subtitle: "Titre, texte et images des 3 cartes",
        fields: [
          { label: "Titre section", path: ["infoCards", "title"], type: "text" },
          { label: "Sous-titre", path: ["infoCards", "subtitle"], type: "textarea" },
          { label: "Carte 1 titre", path: ["infoCards", "cards", "0", "title"], type: "text" },
          { label: "Carte 1 image", path: ["infoCards", "cards", "0", "image"], type: "image" },
          { label: "Carte 1 lien texte", path: ["infoCards", "cards", "0", "linkLabel"], type: "text" },
          { label: "Carte 1 lien", path: ["infoCards", "cards", "0", "linkHref"], type: "text" },
          { label: "Carte 2 titre", path: ["infoCards", "cards", "1", "title"], type: "text" },
          { label: "Carte 2 image", path: ["infoCards", "cards", "1", "image"], type: "image" },
          { label: "Carte 2 lien texte", path: ["infoCards", "cards", "1", "linkLabel"], type: "text" },
          { label: "Carte 2 lien", path: ["infoCards", "cards", "1", "linkHref"], type: "text" },
          { label: "Carte 3 titre", path: ["infoCards", "cards", "2", "title"], type: "text" },
          { label: "Carte 3 image", path: ["infoCards", "cards", "2", "image"], type: "image" },
          { label: "Carte 3 lien texte", path: ["infoCards", "cards", "2", "linkLabel"], type: "text" },
          { label: "Carte 3 lien", path: ["infoCards", "cards", "2", "linkHref"], type: "text" },
          { label: "Bouton texte", path: ["infoCards", "ctaLabel"], type: "text" },
          { label: "Bouton lien", path: ["infoCards", "ctaHref"], type: "text" },
        ],
      },
      {
        id: "products",
        title: "Produits",
        subtitle: "Titres de la section produits",
        fields: [
          { label: "Titre", path: ["products", "title"], type: "text" },
          { label: "Sous-titre", path: ["products", "subtitle"], type: "textarea" },
          { label: "Bouton texte", path: ["products", "ctaLabel"], type: "text" },
          { label: "Bouton lien", path: ["products", "ctaHref"], type: "text" },
        ],
      },
      {
        id: "recipes",
        title: "Recettes",
        subtitle: "Titres de la section recettes",
        fields: [
          { label: "Titre", path: ["recipes", "title"], type: "text" },
          { label: "Sous-titre", path: ["recipes", "subtitle"], type: "textarea" },
          { label: "Bouton texte", path: ["recipes", "ctaLabel"], type: "text" },
          { label: "Bouton lien", path: ["recipes", "ctaHref"], type: "text" },
        ],
      },
      {
        id: "benefits",
        title: "Bénéfices",
        subtitle: "Titre et 3 messages",
        fields: [
          { label: "Titre section", path: ["benefits", "title"], type: "text" },
          { label: "Bénéfice 1 titre", path: ["benefits", "items", "0", "title"], type: "text" },
          { label: "Bénéfice 1 description", path: ["benefits", "items", "0", "description"], type: "textarea" },
          { label: "Bénéfice 2 titre", path: ["benefits", "items", "1", "title"], type: "text" },
          { label: "Bénéfice 2 description", path: ["benefits", "items", "1", "description"], type: "textarea" },
          { label: "Bénéfice 3 titre", path: ["benefits", "items", "2", "title"], type: "text" },
          { label: "Bénéfice 3 description", path: ["benefits", "items", "2", "description"], type: "textarea" },
        ],
      },
    ],
  },
  conseils: {
    title: "Page Conseils",
    defaults: defaultConseilsContent,
    sections: [
      {
        id: "hero",
        title: "Hero",
        subtitle: "Bannière principale",
        fields: [
          { label: "Titre", path: ["hero", "title"], type: "text" },
          { label: "Sous-titre", path: ["hero", "subtitle"], type: "textarea" },
          { label: "Image hero (URL)", path: ["hero", "image"], type: "image" },
          { label: "Bouton texte", path: ["hero", "ctaLabel"], type: "text" },
          { label: "Bouton lien", path: ["hero", "ctaHref"], type: "text" },
        ],
      },
      {
        id: "intro",
        title: "Introduction",
        subtitle: "Badge et texte d'introduction",
        fields: [
          { label: "Badge", path: ["intro", "badge"], type: "text" },
          { label: "Titre", path: ["intro", "title"], type: "text" },
          { label: "Texte", path: ["intro", "text"], type: "textarea" },
        ],
      },
      {
        id: "adviceCards",
        title: "Cartes conseil",
        subtitle: "Titres et textes des 4 cartes",
        fields: [
          { label: "Carte 1 icône", path: ["adviceCards", "0", "icon"], type: "text" },
          { label: "Carte 1 titre", path: ["adviceCards", "0", "title"], type: "text" },
          { label: "Carte 1 texte", path: ["adviceCards", "0", "text"], type: "textarea" },
          { label: "Carte 2 icône", path: ["adviceCards", "1", "icon"], type: "text" },
          { label: "Carte 2 titre", path: ["adviceCards", "1", "title"], type: "text" },
          { label: "Carte 2 texte", path: ["adviceCards", "1", "text"], type: "textarea" },
          { label: "Carte 3 icône", path: ["adviceCards", "2", "icon"], type: "text" },
          { label: "Carte 3 titre", path: ["adviceCards", "2", "title"], type: "text" },
          { label: "Carte 3 texte", path: ["adviceCards", "2", "text"], type: "textarea" },
          { label: "Carte 4 icône", path: ["adviceCards", "3", "icon"], type: "text" },
          { label: "Carte 4 titre", path: ["adviceCards", "3", "title"], type: "text" },
          { label: "Carte 4 texte", path: ["adviceCards", "3", "text"], type: "textarea" },
        ],
      },
      {
        id: "quickLinks",
        title: "Liens rapides",
        subtitle: "2 tuiles de navigation",
        fields: [
          { label: "Lien 1 titre", path: ["quickLinks", "0", "title"], type: "text" },
          { label: "Lien 1 texte", path: ["quickLinks", "0", "text"], type: "textarea" },
          { label: "Lien 1 URL", path: ["quickLinks", "0", "href"], type: "text" },
          { label: "Lien 2 titre", path: ["quickLinks", "1", "title"], type: "text" },
          { label: "Lien 2 texte", path: ["quickLinks", "1", "text"], type: "textarea" },
          { label: "Lien 2 URL", path: ["quickLinks", "1", "href"], type: "text" },
        ],
      },
    ],
  },
  about: {
    title: "Page About",
    defaults: defaultAboutContent,
    sections: [
      {
        id: "hero",
        title: "Hero",
        subtitle: "Image header et titre principal",
        fields: [
          { label: "Titre", path: ["hero", "title"], type: "text" },
          { label: "Image header (URL)", path: ["hero", "image"], type: "image" },
        ],
      },
      {
        id: "intro",
        title: "Introduction",
        subtitle: "Texte d'ouverture",
        fields: [{ label: "Texte intro", path: ["intro", "text"], type: "textarea" }],
      },
      {
        id: "positioning",
        title: "Positionnement",
        subtitle: "Section image + arguments",
        fields: [
          { label: "Titre", path: ["positioning", "title"], type: "text" },
          { label: "Paragraphe 1", path: ["positioning", "text1"], type: "textarea" },
          { label: "Paragraphe 2", path: ["positioning", "text2"], type: "textarea" },
          { label: "Paragraphe 3", path: ["positioning", "text3"], type: "textarea" },
          { label: "Image section (URL)", path: ["positioning", "image"], type: "image" },
        ],
      },
      {
        id: "manufacturing",
        title: "Fabrication",
        subtitle: "Section fabrique/qualité",
        fields: [
          { label: "Titre", path: ["manufacturing", "title"], type: "text" },
          { label: "Paragraphe 1", path: ["manufacturing", "text1"], type: "textarea" },
          { label: "Paragraphe 2", path: ["manufacturing", "text2"], type: "textarea" },
          { label: "Image section (URL)", path: ["manufacturing", "image"], type: "image" },
        ],
      },
      {
        id: "innovation",
        title: "Innovation",
        subtitle: "Badge + titre + texte",
        fields: [
          { label: "Badge", path: ["innovation", "badge"], type: "text" },
          { label: "Titre", path: ["innovation", "title"], type: "text" },
          { label: "Texte", path: ["innovation", "text"], type: "textarea" },
        ],
      },
    ],
  },
  recipes: {
    title: "Page Recipes",
    defaults: defaultRecipesContent,
    sections: [
      {
        id: "hero",
        title: "Hero",
        subtitle: "Image header + titre + sous-titre",
        fields: [
          { label: "Titre", path: ["hero", "title"], type: "text" },
          { label: "Sous-titre", path: ["hero", "subtitle"], type: "textarea" },
          { label: "Image header (URL)", path: ["hero", "image"], type: "image" },
        ],
      },
      {
        id: "benefits",
        title: "Bandeau bénéfices",
        subtitle: "3 messages clés",
        fields: [
          { label: "Bénéfice 1", path: ["benefitsStrip", "0", "text"], type: "text" },
          { label: "Bénéfice 2", path: ["benefitsStrip", "1", "text"], type: "text" },
          { label: "Bénéfice 3", path: ["benefitsStrip", "2", "text"], type: "text" },
        ],
      },
      {
        id: "promos",
        title: "Cartes promo",
        subtitle: "Titres + texte + CTA",
        fields: [
          { label: "Promo 1 titre", path: ["promos", "0", "title"], type: "text" },
          { label: "Promo 1 texte", path: ["promos", "0", "desc"], type: "textarea" },
          { label: "Promo 1 CTA", path: ["promos", "0", "cta"], type: "text" },
          { label: "Promo 2 titre", path: ["promos", "1", "title"], type: "text" },
          { label: "Promo 2 texte", path: ["promos", "1", "desc"], type: "textarea" },
          { label: "Promo 2 CTA", path: ["promos", "1", "cta"], type: "text" },
          { label: "Promo 3 titre", path: ["promos", "2", "title"], type: "text" },
          { label: "Promo 3 texte", path: ["promos", "2", "desc"], type: "textarea" },
          { label: "Promo 3 CTA", path: ["promos", "2", "cta"], type: "text" },
        ],
      },
    ],
  },
};

const getByPath = (obj: unknown, path: string[]) => {
  let current: any = obj;
  for (const segment of path) {
    if (current == null) return "";
    current = current[segment];
  }
  return typeof current === "string" ? current : "";
};

const setByPath = (obj: unknown, path: string[], value: string) => {
  const clone: any = structuredClone(obj);
  let current = clone;

  for (let i = 0; i < path.length - 1; i += 1) {
    const key = path[i];
    if (current[key] == null) {
      current[key] = /^\d+$/.test(path[i + 1]) ? [] : {};
    }
    current = current[key];
  }

  current[path[path.length - 1]] = value;
  return clone;
};

const AdminContentEditor = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [pageKey, setPageKey] = useState<PageKey>("home");
  const [activeSectionId, setActiveSectionId] = useState<string>(pageConfigs.home.sections[0].id);
  const [draft, setDraft] = useState<PageContentMap[PageKey]>(pageConfigs.home.defaults);
  const [imagePreviews, setImagePreviews] = useState<Record<string, string>>({});
  const [uploadingFieldKey, setUploadingFieldKey] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const config = pageConfigs[pageKey];

  const { data, isLoading } = useQuery({
    queryKey: ["admin-page-content", pageKey],
    queryFn: () => fetchAdminPageContent(pageKey, config.defaults as any),
  });

  useEffect(() => {
    if (!data) return;
    setDraft(data as any);
    setActiveSectionId(config.sections[0]?.id ?? "");
    setImagePreviews({});
    setUploadError(null);
  }, [data, config.sections, pageKey]);

  const activeSection = useMemo(
    () => config.sections.find((section) => section.id === activeSectionId) ?? config.sections[0],
    [activeSectionId, config.sections],
  );

  const saveMutation = useMutation({
    mutationFn: () => saveAdminPageContent(pageKey, draft as any),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-page-content", pageKey] });
      await queryClient.invalidateQueries({ queryKey: ["page-content", pageKey] });
    },
  });

  const onLogout = async () => {
    await signOut();
    navigate("/admin/login");
  };

  const handleImageUpload = async (field: FieldDef, file: File) => {
    const fieldKey = `${activeSection.id}:${field.path.join(".")}`;
    const previewUrl = URL.createObjectURL(file);
    setUploadError(null);
    setUploadingFieldKey(fieldKey);
    setImagePreviews((prev) => ({ ...prev, [fieldKey]: previewUrl }));

    try {
      const uploadedUrl = await uploadPageContentImage(file, pageKey, activeSection.id, field.path.join("-") || "image");
      setDraft((prev) => setByPath(prev, field.path, uploadedUrl));
      setImagePreviews((prev) => ({ ...prev, [fieldKey]: uploadedUrl }));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Impossible d'uploader l'image";
      setUploadError(message);
      setImagePreviews((prev) => {
        const next = { ...prev };
        if (next[fieldKey] === previewUrl) delete next[fieldKey];
        return next;
      });
    } finally {
      URL.revokeObjectURL(previewUrl);
      setUploadingFieldKey(null);
    }
  };

  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">Éditeur Visuel de Contenu</h1>
            <p className="text-muted-foreground">Cliquez sur un bloc de la maquette puis modifiez le texte ou l'image.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/admin/products" className="rounded-full border border-border px-5 py-2 text-sm font-semibold text-foreground hover:bg-muted">Produits</Link>
            <Link to="/admin/recipes" className="rounded-full border border-border px-5 py-2 text-sm font-semibold text-foreground hover:bg-muted">Recettes</Link>
            <button onClick={onLogout} className="rounded-full border border-border px-5 py-2 text-sm font-semibold text-foreground hover:bg-muted">Déconnexion</button>
          </div>
        </div>

        <div className="mb-4 flex items-center gap-3">
          <label className="text-sm font-medium text-foreground">Page à éditer</label>
          <select
            value={pageKey}
            onChange={(e) => setPageKey(e.target.value as PageKey)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="home">Home</option>
              <option value="conseils">Conseils</option>
            <option value="about">About</option>
            <option value="recipes">Recipes</option>
          </select>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="mb-3 text-xs text-muted-foreground">Maquette interactive (cliquez un bloc pour éditer)</p>
            <div className="grid gap-3">
              {config.sections.map((section) => {
                const firstField = section.fields[0];
                const preview = firstField ? getByPath(draft, firstField.path) : "";
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSectionId(section.id)}
                    className={`w-full rounded-xl border p-4 text-left transition-colors ${
                      section.id === activeSection.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-muted/50"
                    }`}
                  >
                    <p className="text-sm font-semibold text-foreground">{section.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{section.subtitle}</p>
                    <p className="mt-2 truncate text-xs text-foreground/80">{preview || "Cliquez pour éditer"}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Chargement...</p>
            ) : (
              <div className="space-y-4">
                <div>
                  <h2 className="font-heading text-xl font-bold text-foreground">{activeSection.title}</h2>
                  <p className="text-sm text-muted-foreground">{activeSection.subtitle}</p>
                </div>

                {activeSection.fields.map((field) => {
                  const value = getByPath(draft, field.path);
                  const fieldKey = `${activeSection.id}:${field.path.join(".")}`;
                  const previewSource = imagePreviews[fieldKey] ?? value;
                  const isUploadingImage = uploadingFieldKey === fieldKey;
                  return (
                    <div key={field.path.join(".")}>
                      <label className="mb-1 block text-sm font-medium text-foreground">{field.label}</label>
                      {field.type === "image" ? (
                        <div className="space-y-3 rounded-xl border border-dashed border-border bg-muted/20 p-3">
                          <div className="overflow-hidden rounded-lg border border-border bg-background">
                            {previewSource ? (
                              <img
                                src={previewSource}
                                alt={field.label}
                                className="h-48 w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
                                Aucune image sélectionnée
                              </div>
                            )}
                          </div>

                          <input
                            value={value}
                            onChange={(e) => setDraft((prev) => setByPath(prev, field.path, e.target.value))}
                            placeholder="https://..."
                            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                          />

                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                            <label className="inline-flex cursor-pointer items-center justify-center rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted">
                              {isUploadingImage ? "Upload en cours..." : "Choisir une image"}
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                disabled={isUploadingImage}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  e.target.value = "";
                                  if (!file) return;
                                  void handleImageUpload(field, file);
                                }}
                              />
                            </label>
                            <p className="text-xs text-muted-foreground">PNG, JPG, WebP. L’image est prévisualisée puis importée dans le site.</p>
                          </div>
                        </div>
                      ) : field.type === "textarea" ? (
                        <textarea
                          value={value}
                          onChange={(e) => setDraft((prev) => setByPath(prev, field.path, e.target.value))}
                          rows={4}
                          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                        />
                      ) : (
                        <input
                          value={value}
                          onChange={(e) => setDraft((prev) => setByPath(prev, field.path, e.target.value))}
                          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                        />
                      )}
                    </div>
                  );
                })}

                {uploadError ? <p className="text-sm text-destructive">{uploadError}</p> : null}

                <button
                  onClick={() => saveMutation.mutate()}
                  disabled={saveMutation.isPending}
                  className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
                >
                  {saveMutation.isPending ? "Enregistrement..." : `Enregistrer ${config.title}`}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminContentEditor;
