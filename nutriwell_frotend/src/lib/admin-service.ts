import { apiRequest } from "@/lib/api";

export interface AdminProductItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  texture: string;
  gout: string;
  regime: string;
  is_published: boolean;
  updated_at: string;
}

export interface NutritionInput {
  nutriment: string;
  per100ml: string;
  perPortion: string;
}

export interface NutritionTableInput {
  headers: string[];
  rows: string[][];
}

export interface UsageTipInput {
  icon: string;
  text: string;
}

export interface ReviewInput {
  name: string;
  rating: number;
  text: string;
  date: string;
}

export interface AdminProductFormInput {
  slug: string;
  name: string;
  category: string;
  shortDescription: string;
  texture: string;
  gout: string;
  regime: string;
  badge: string;
  badgeColor: string;
  image: string;
  rating: number;
  reviewCount: number;
  isPublished: boolean;
  descriptions: string[];
  benefits: string[];
  flavors: string[];
  formats: string[];
  ingredients: string[];
  importantNotice: string[];
  nutrition: NutritionInput[];
  nutritionTable?: NutritionTableInput;
  usageTips: UsageTipInput[];
  images: string[];
  reviews: ReviewInput[];
}

const clean = (value: string) => value.trim();

export const signInWithEmail = async (email: string, password: string) => {
  return apiRequest<{ session: unknown; user: unknown }>("auth/login", {
    method: "POST",
    body: { email: clean(email), password },
  });
};

export const signOut = async () => {
  await apiRequest<{ success: boolean }>("auth/logout", { method: "POST" });
};

export const getCurrentSession = async () => {
  const response = await apiRequest<{ session: unknown | null }>("auth/session", { method: "GET" });
  return response.session;
};

export const isCurrentUserAdmin = async () => {
  const response = await apiRequest<{ isAdmin: boolean }>("auth/me", { method: "GET" });
  return response.isAdmin;
};

export const fetchAdminProducts = async (): Promise<AdminProductItem[]> => {
  const response = await apiRequest<{ products: AdminProductItem[] }>("admin/products", { method: "GET" });
  return response.products ?? [];
};

export const updateProductPublishStatus = async (productId: string, nextStatus: boolean) => {
  await apiRequest<{ success: boolean }>(`admin/products/${productId}/publish`, {
    method: "PATCH",
    body: { isPublished: nextStatus },
  });
};

export const fetchAdminProductById = async (productId: string): Promise<AdminProductFormInput> => {
  const response = await apiRequest<{ product: AdminProductFormInput }>(`admin/products/${productId}`, {
    method: "GET",
  });
  return response.product;
};

export const saveAdminProduct = async (input: AdminProductFormInput, productId?: string) => {
  const payload = {
    slug: clean(input.slug),
    name: clean(input.name),
    category: clean(input.category),
    shortDescription: clean(input.shortDescription),
    texture: clean(input.texture),
    gout: clean(input.gout),
    regime: clean(input.regime),
    // price and pricePerUnit removed
    badge: clean(input.badge),
    badgeColor: clean(input.badgeColor),
    image: clean(input.image),
    rating: Number(input.rating) || 0,
    reviewCount: Number(input.reviewCount) || 0,
    isPublished: input.isPublished,
    descriptions: input.descriptions,
    benefits: input.benefits,
    flavors: input.flavors,
    formats: input.formats,
    ingredients: input.ingredients,
    importantNotice: input.importantNotice,
    nutrition: input.nutrition,
    nutritionTable: input.nutritionTable,
    usageTips: input.usageTips,
    images: input.images,
    reviews: input.reviews,
  };

  const response = await apiRequest<{ id: string }>(productId ? `admin/products/${productId}` : "admin/products", {
    method: productId ? "PUT" : "POST",
    body: payload,
  });
  return response.id;
};

const sanitizeFileName = (name: string) =>
  name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._-]/g, "");

export const uploadProductImage = async (
  file: File,
  productSlug: string,
  folder: "main" | "gallery" = "gallery",
) => {
  const formData = new FormData();
  formData.append("slug", clean(productSlug) || "draft-product");
  formData.append("folder", folder);
  formData.append("file", file, sanitizeFileName(file.name || `image-${Date.now()}.jpg`));
  const response = await apiRequest<{ url: string }>("admin/uploads/product-image", {
    method: "POST",
    body: formData,
  });
  return response.url;
};
