import { ApiError, apiRequest } from "@/lib/api";

export interface NutritionTableInput {
  headers: string[];
  rows: string[][];
}

export interface RecipeListItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  summary: string;
  prep_time: string;
  servings: number;
  image: string | null;
  is_published: boolean;
  updated_at: string;
}

export interface RecipeDetail {
  id: string;
  slug: string;
  title: string;
  category: string;
  summary: string;
  prepTime: string;
  servings: number;
  image: string;
  ingredients: string[];
  steps: string[];
  tips: string[];
  nutrition: string[];
  nutritionTable?: NutritionTableInput;
}

export interface RecipeFormInput {
  slug: string;
  title: string;
  category: string;
  summary: string;
  prepTime: string;
  servings: number;
  image: string;
  ingredients: string[];
  steps: string[];
  tips: string[];
  nutrition: string[];
  nutritionTable?: NutritionTableInput;
  isPublished: boolean;
}

const clean = (value: string) => value.trim();

const normalizeApiError = (error: unknown) => {
  if (!(error instanceof ApiError)) return error as Error;
  if (error.status === 409) return new Error("recipes_slug_key");
  if (error.status === 422) return new Error("recipes_slug_format");
  return new Error(error.message || "Erreur API inconnue lors de l'enregistrement de la recette.");
};

export const fetchPublishedRecipes = async (category?: string): Promise<RecipeListItem[]> => {
  const response = await apiRequest<{ recipes: RecipeListItem[] }>("recipes", {
    method: "GET",
    query: { published: true, category: category && category !== "Toutes" ? category : undefined },
  });
  return response.recipes ?? [];
};

export const fetchPublishedRecipeBySlug = async (slug: string): Promise<RecipeDetail | null> => {
  const response = await apiRequest<{ recipe: RecipeDetail | null }>(`recipes/${slug}`, {
    method: "GET",
    query: { published: true },
  });
  return response.recipe;
};

export const fetchAdminRecipes = async (): Promise<RecipeListItem[]> => {
  const response = await apiRequest<{ recipes: RecipeListItem[] }>("admin/recipes", { method: "GET" });
  return response.recipes ?? [];
};

export const fetchAdminRecipeById = async (recipeId: string): Promise<RecipeFormInput> => {
  const response = await apiRequest<{ recipe: RecipeFormInput }>(`admin/recipes/${recipeId}`, { method: "GET" });
  return response.recipe;
};

export const saveAdminRecipe = async (input: RecipeFormInput, recipeId?: string) => {
  const payload = {
    slug: clean(input.slug),
    title: clean(input.title),
    category: clean(input.category),
    summary: clean(input.summary),
    prep_time: clean(input.prepTime),
    servings: Number(input.servings) || 1,
    image: clean(input.image) || null,
    ingredients: input.ingredients.map(clean).filter(Boolean),
    steps: input.steps.map(clean).filter(Boolean),
    tips: input.tips.map(clean).filter(Boolean),
    nutrition: input.nutrition.map(clean).filter(Boolean),
    nutritionTable: input.nutritionTable,
    is_published: input.isPublished,
  };

  try {
    if (recipeId) {
      const response = await apiRequest<{ id: string }>(`admin/recipes/${recipeId}`, { method: "PUT", body: payload });
      return response.id;
    }
    const response = await apiRequest<{ id: string }>("admin/recipes", { method: "POST", body: payload });
    return response.id;
  } catch (error) {
    throw normalizeApiError(error);
  }
};

export const updateRecipePublishStatus = async (recipeId: string, nextStatus: boolean) => {
  await apiRequest<{ success: boolean }>(`admin/recipes/${recipeId}/publish`, {
    method: "PATCH",
    body: { isPublished: nextStatus },
  });
};

export const deleteRecipe = async (recipeId: string) => {
  await apiRequest<{ success: boolean }>(`admin/recipes/${recipeId}`, { method: "DELETE" });
};

const sanitizeFileName = (name: string) =>
  name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._-]/g, "");

export const uploadRecipeImage = async (file: File, recipeSlug: string) => {
  const formData = new FormData();
  formData.append("slug", clean(recipeSlug) || "draft-recipe");
  formData.append("file", file, sanitizeFileName(file.name || `recipe-${Date.now()}.jpg`));
  const response = await apiRequest<{ url: string }>("admin/uploads/recipe-image", {
    method: "POST",
    body: formData,
  });
  return response.url;
};
