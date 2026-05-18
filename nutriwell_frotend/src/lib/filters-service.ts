import { apiRequest } from "@/lib/api";
import type { FilterCategoryGroup } from "@/lib/admin-service";

export const fetchPublicFilters = async (): Promise<Record<string, FilterCategoryGroup>> => {
  const response = await apiRequest<{ filters: Record<string, FilterCategoryGroup> }>("filters", { method: "GET" });
  return response.filters ?? {};
};
