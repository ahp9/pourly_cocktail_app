// Small fetch wrapper: base URL, auth header, timeout, readable errors.
// Set EXPO_PUBLIC_API_URL in .env (e.g. https://api.pourly.app).
// While it's empty, services fall back to mock data.

export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "";
export const USE_MOCK = API_URL === "";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type Options = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string;
  signal?: AbortSignal;
  timeoutMs?: number;
};

export async function apiFetch<T>(
  path: string,
  opts: Options = {},
): Promise<T> {
  const { method = "GET", body, token, signal, timeoutMs = 10_000 } = opts;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  signal?.addEventListener("abort", () => controller.abort());

  try {
    const res = await fetch(`${API_URL}${path}`, {
      method,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        ...(body !== undefined && { "Content-Type": "application/json" }),
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      throw new ApiError(data?.message ?? messageFor(res.status), res.status);
    }

    return (await res.json()) as T;
  } catch (e) {
    if (e instanceof ApiError) throw e;
    if (controller.signal.aborted && !signal?.aborted) {
      throw new ApiError("Pourly is taking too long to respond. Try again.", 0);
    }
    throw e instanceof Error && e.name === "AbortError"
      ? e
      : new ApiError("Can't reach Pourly. Check your connection.", 0);
  } finally {
    clearTimeout(timer);
  }
}

function messageFor(status: number) {
  if (status === 401) return "Your session has ended. Sign in again.";
  if (status === 404) return "We couldn't find that.";
  if (status >= 500) return "Something went wrong on our side. Try again.";
  return "Something went wrong. Try again.";
}
