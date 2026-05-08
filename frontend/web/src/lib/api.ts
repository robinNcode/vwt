export type ApiOk<T> = {
  success: true;
  message?: string;
  data: T;
  meta?: unknown;
};

export type ApiErr = {
  success: false;
  message?: string;
  errors?: unknown;
};

export type ApiResponse<T> = ApiOk<T> | ApiErr;

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") || "http://localhost:8083/api/v1";
}

export class ApiError extends Error {
  status: number;
  payload?: unknown;

  constructor(message: string, status: number, payload?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit & { token?: string | null } = {},
): Promise<ApiOk<T>> {
  const url = `${getBaseUrl()}${path.startsWith("/") ? "" : "/"}${path}`;
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  if (!headers.has("Content-Type") && init.body) headers.set("Content-Type", "application/json");
  if (init.token) headers.set("Authorization", `Bearer ${init.token}`);

  const res = await fetch(url, { ...init, headers, cache: "no-store" });
  const text = await res.text();

  let json: ApiResponse<T> | undefined;
  try {
    json = text ? (JSON.parse(text) as ApiResponse<T>) : undefined;
  } catch {
    // ignore
  }

  if (!res.ok) {
    throw new ApiError(json?.message || `Request failed (${res.status})`, res.status, json ?? text);
  }

  if (!json || json.success !== true) {
    throw new ApiError((json as ApiErr | undefined)?.message || "Unexpected API response", res.status, json ?? text);
  }

  return json;
}

