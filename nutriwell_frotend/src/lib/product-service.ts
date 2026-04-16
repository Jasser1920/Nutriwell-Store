import type { Product } from "@/data/products";
import { apiRequest } from "@/lib/api";

export interface ProductCardItem {
  slug: string;
  name: string;
  flavors: string;
  image: string;
  texture: string;
  gout: string;
  regime: string;
  badge?: string;
  badgeColor?: string;
}

const buildFlavorsLabel = (count: number) => (count <= 1 ? "1 saveur" : `${count} saveurs`);
const apiBase = (import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001").replace(/\/+$/, "");

const normalizeMediaUrl = (value: string | undefined | null) => {
  const raw = (value ?? "").trim();
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  if (raw.startsWith("//")) return `http:${raw}`;
  if (raw.startsWith("/")) return `${apiBase}${raw}`;
  return `${apiBase}/${raw.replace(/^\/+/, "")}`;
};

export const fetchProductCards = async (filters: {
  activeTexture?: string;
  activeGout?: string;
  activeRegime?: string;
}): Promise<ProductCardItem[]> => {
  const response = await apiRequest<{
    products: Array<ProductCardItem & { flavorsLabel?: string; flavors?: string[]; flavorCount?: number }>;
  }>("products", {
    method: "GET",
    query: {
      published: true,
      texture: filters.activeTexture,
      gout: filters.activeGout,
      regime: filters.activeRegime,
    },
  });

  return (response.products ?? []).map((product) => ({
    slug: product.slug,
    name: product.name,
    flavors:
      typeof product.flavors === "string"
        ? product.flavors
        : product.flavorsLabel ?? buildFlavorsLabel(product.flavorCount ?? product.flavors?.length ?? 0),
    image: normalizeMediaUrl(product.image),
    texture: product.texture,
    gout: product.gout,
    regime: product.regime,
    badge: product.badge,
    badgeColor: product.badgeColor,
  }));
};

export const fetchProductBySlug = async (slug: string): Promise<Product | null> => {
  const response = await apiRequest<{ product: Product | null }>(`products/${slug}`, {
    method: "GET",
    query: { published: true },
  });

  if (!response.product) return null;

  const normalizedImages = (response.product.images ?? [])
    .map((image) => normalizeMediaUrl(image))
    .filter(Boolean);
  const normalizedMainImage = normalizeMediaUrl(response.product.image);

  return {
    ...response.product,
    image: normalizedMainImage || normalizedImages[0] || "",
    images: normalizedImages.length
      ? normalizedImages
      : normalizedMainImage
        ? [normalizedMainImage]
        : [],
  };
};

export const fetchRelatedProducts = async (currentSlug: string): Promise<Array<Pick<Product, "slug" | "name" | "image" | "flavors">>> => {
  const response = await apiRequest<{ products: Array<Pick<Product, "slug" | "name" | "image" | "flavors">> }>("products", {
    method: "GET",
    query: { published: true, excludeSlug: currentSlug, limit: 4 },
  });
  return (response.products ?? []).map((product) => ({
    ...product,
    image: normalizeMediaUrl(product.image),
  }));
};
