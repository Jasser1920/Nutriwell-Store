const apiBase = (import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001").replace(/\/+$/, "");

type QueryValue = string | number | boolean | null | undefined;

const buildUrl = (path: string, query?: Record<string, QueryValue>) => {
  const normalizedPath = path.replace(/^\/+/, "");
  const url = new URL(`${apiBase}/${normalizedPath}`);
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;
      url.searchParams.set(key, String(value));
    });
  }
  return url.toString();
};

const isJson = (response: Response) =>
  (response.headers.get("content-type") ?? "").toLowerCase().includes("application/json");

export class ApiError extends Error {
  status: number;
  payload: unknown;

  constructor(message: string, status: number, payload: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

export const apiRequest = async <T>(
  path: string,
  options: Omit<RequestInit, "body"> & {
    body?: BodyInit | Record<string, unknown> | null;
    query?: Record<string, QueryValue>;
  } = {},
): Promise<T> => {
  const { query, body, headers, ...rest } = options;
  const url = buildUrl(path, query);
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  const response = await fetch(url, {
    credentials: "include",
    ...rest,
    headers: {
      Accept: "application/json",
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(headers ?? {}),
    },
    body: body == null ? undefined : isFormData || typeof body === "string" ? body : JSON.stringify(body),
  });

  const payload = isJson(response) ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      (typeof payload === "object" && payload && (payload as Record<string, unknown>).message) ||
      (typeof payload === "string" ? payload : `HTTP ${response.status}`);
    throw new ApiError(String(message), response.status, payload);
  }

  return payload as T;
};
