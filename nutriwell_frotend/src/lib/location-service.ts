import { apiRequest } from "@/lib/api";

export interface PharmacyLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  distance: string;
  lat: number;
  lng: number;
  phone: string;
}

export type PharmacyLocationInput = Omit<PharmacyLocation, "id">;

export const fetchLocations = async (): Promise<PharmacyLocation[]> => {
  const res = await apiRequest<{ locations: PharmacyLocation[] }>("locations", { method: "GET" });
  return res.locations ?? [];
};

export const createLocation = async (input: PharmacyLocationInput): Promise<{ id: string }> =>
  apiRequest("admin/locations", { method: "POST", body: input as unknown as Record<string, unknown> });

export const updateLocation = async (id: string, input: PharmacyLocationInput): Promise<{ id: string }> =>
  apiRequest(`admin/locations/${id}`, { method: "PUT", body: input as unknown as Record<string, unknown> });

export const deleteLocation = async (id: string): Promise<void> => {
  await apiRequest(`admin/locations/${id}`, { method: "DELETE" });
};
