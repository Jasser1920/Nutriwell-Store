import { apiRequest } from "@/lib/api";

export interface AboutPageContent {
  hero: { title: string; image: string };
  intro: { text: string };
  positioning: { title: string; text1: string; text2: string; text3: string; image: string };
  manufacturing: { title: string; text1: string; text2: string; image: string };
  innovation: { badge: string; title: string; text: string };
  quality: { title: string; text1: string; text2: string };
  benefits: { title: string; items: Array<{ title: string; desc: string }> };
}

export interface HomePageContent {
  hero: { title: string; subtitle: string; image: string; ctaLabel: string; ctaHref: string };
  infoCards: {
    title: string;
    subtitle: string;
    cards: Array<{ title: string; image: string; linkLabel: string; linkHref: string }>;
    ctaLabel: string;
    ctaHref: string;
  };
  products: { title: string; subtitle: string; ctaLabel: string; ctaHref: string };
  recipes: { title: string; subtitle: string; ctaLabel: string; ctaHref: string };
  benefits: {
    title: string;
    items: Array<{ title: string; description: string }>;
  };
}

export interface RecipesPageContent {
  hero: { title: string; subtitle: string; image: string };
  benefitsStrip: Array<{ text: string }>;
  promos: Array<{ title: string; desc: string; cta: string }>;
}

export interface ConseilsPageContent {
  hero: { title: string; subtitle: string; image: string; ctaLabel: string; ctaHref: string };
  intro: { badge: string; title: string; text: string };
  adviceCards: Array<{ icon: string; title: string; text: string }>;
  quickLinks: Array<{ title: string; text: string; href: string }>;
}

export type PageContentMap = {
  home: HomePageContent;
  about: AboutPageContent;
  recipes: RecipesPageContent;
  conseils: ConseilsPageContent;
};

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const deepMerge = <T>(base: T, patch: unknown): T => {
  if (Array.isArray(base)) {
    return (Array.isArray(patch) ? patch : base) as T;
  }

  if (!isObject(base)) {
    return (patch === undefined || patch === null ? base : patch) as T;
  }

  const output: Record<string, unknown> = { ...base };
  const patchObj = isObject(patch) ? patch : {};

  for (const key of Object.keys(output)) {
    output[key] = deepMerge(output[key], patchObj[key]);
  }

  return output as T;
};

export const fetchPublicPageContent = async <K extends keyof PageContentMap>(
  pageKey: K,
  defaults: PageContentMap[K],
): Promise<PageContentMap[K]> => {
  const response = await apiRequest<{ pageKey: string; content: unknown }>(`content/${pageKey}`, {
    method: "GET",
  });
  return deepMerge(defaults, response.content);
};

export const fetchAdminPageContent = async <K extends keyof PageContentMap>(
  pageKey: K,
  defaults: PageContentMap[K],
): Promise<PageContentMap[K]> => {
  const response = await apiRequest<{ pageKey: string; content: unknown }>(`admin/content/${pageKey}`, {
    method: "GET",
  });
  return deepMerge(defaults, response.content);
};

export const saveAdminPageContent = async <K extends keyof PageContentMap>(
  pageKey: K,
  content: PageContentMap[K],
) => {
  return apiRequest<{ pageKey: string; content: unknown; updatedAt: string | null }>(`admin/content/${pageKey}`, {
    method: "PUT",
    body: { content },
  });
};

const sanitizeFileName = (name: string) =>
  name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._-]/g, "");

export const uploadPageContentImage = async (
  file: File,
  pageKey: keyof PageContentMap,
  sectionId: string,
  fieldKey: string,
) => {
  const formData = new FormData();
  formData.append("pageKey", String(pageKey));
  formData.append("section", sectionId);
  formData.append("field", fieldKey);
  formData.append("file", file, sanitizeFileName(file.name || `image-${Date.now()}.jpg`));

  const response = await apiRequest<{ url: string }>("admin/uploads/content-image", {
    method: "POST",
    body: formData,
  });

  return response.url;
};
