export async function apiJson<T>(
  url: string,
  init?: RequestInit,
): Promise<{ ok: true; data: T } | { ok: false; error: string; status: number }> {
  try {
    const response = await fetch(url, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
    });
    const body = (await response.json().catch(() => ({}))) as {
      error?: string;
    } & T;
    if (!response.ok) {
      return {
        ok: false,
        error: body.error ?? "serverError",
        status: response.status,
      };
    }
    return { ok: true, data: body as T };
  } catch {
    return { ok: false, error: "network", status: 0 };
  }
}
