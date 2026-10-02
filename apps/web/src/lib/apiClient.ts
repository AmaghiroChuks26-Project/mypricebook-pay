export class ApiRequestError extends Error {
  constructor(readonly status: number) {
    super(`API request failed with status ${status}`);
    this.name = "ApiRequestError";
  }
}

export async function requestJson<ResponseData>(
  path: string,
  init: RequestInit = {},
): Promise<ResponseData> {
  const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/+$/, "");
  const requestPath = path.replace(/^\/+/, "");
  const headers = new Headers(init.headers);

  headers.set("Accept", "application/json");
  if (init.body && !(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${apiBaseUrl}/${requestPath}`, {
    ...init,
    credentials: "include",
    headers,
  });

  if (!response.ok) {
    throw new ApiRequestError(response.status);
  }

  if (response.status === 204) {
    return undefined as ResponseData;
  }

  return response.json() as Promise<ResponseData>;
}