import { apiRequest } from "./api";

export interface CreateOrderItemPayload {
  productId?: number | string;
  productSlug?: string;
  productName: string;
  flavor?: string;
  format?: string;
  unitPriceTtc: number;
  quantity: number;
}

export interface CreateOrderPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  postalCode?: string;
  city?: string;
  notes?: string;
  items: CreateOrderItemPayload[];
}

export interface OrderItem {
  id: string;
  productName: string;
  productSlug?: string;
  flavor?: string;
  format?: string;
  unitPriceTtc: number;
  quantity: number;
  totalPriceTtc: number;
}

export interface Order {
  id: string;
  orderReference: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  postalCode?: string;
  city?: string;
  notes?: string;
  totalTtc: number;
  status: "en_attente" | "acceptee" | "refusee";
  createdAt: string;
  itemsCount?: number;
  items?: OrderItem[];
}

export const createOrder = async (payload: CreateOrderPayload) => {
  return apiRequest<{
    success: boolean;
    orderReference: string;
    totalTtc: number;
    message: string;
  }>("orders", {
    method: "POST",
    body: payload,
  });
};

export const fetchOrderByReference = async (reference: string) => {
  const response = await apiRequest<{ order: Order }>(`orders/${reference}`, {
    method: "GET",
  });
  return response.order;
};

export const fetchAdminOrders = async (status?: string) => {
  const response = await apiRequest<{ orders: Order[] }>("admin/orders", {
    method: "GET",
    query: { status: status ?? "all" },
  });
  return response.orders ?? [];
};

export const updateOrderStatus = async (id: string, status: "en_attente" | "acceptee" | "refusee") => {
  return apiRequest<{ success: boolean; status: string }>(`admin/orders/${id}/status`, {
    method: "PATCH",
    body: { status },
  });
};

export const deleteOrder = async (id: string) => {
  return apiRequest<{ success: boolean }>(`admin/orders/${id}`, {
    method: "DELETE",
  });
};
