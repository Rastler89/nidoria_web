import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock de js-cookie: controlamos lo que "leemos" de cookies
vi.mock("js-cookie", () => ({
  default: {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
  },
}));

import Cookies from "js-cookie";
import { apiFetch } from "./api-client";

const mockCookies = vi.mocked(Cookies);

// js-cookie tipa `get` con sobrecargas; usamos esta forma para mockear por clave.
type GetImpl = (key: string) => string | undefined;
function mockCookieGet(impl: GetImpl) {
  mockCookies.get.mockImplementation(impl as unknown as () => {
    [key: string]: string;
  });
}

function jsonResponse(status: number, body: unknown) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response;
}

describe("apiFetch (client-side)", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // jsdom no implementa location.href de forma navegable; lo stubamos
    Object.defineProperty(window, "location", {
      value: { href: "/" },
      writable: true,
    });
    global.fetch = fetchMock;
  });

  it("sends the Authorization header from the auth_token cookie", async () => {
    mockCookieGet((key) =>
      key === "auth_token" ? "token-123" : undefined,
    );
    fetchMock.mockResolvedValue(jsonResponse(200, { ok: true }));

    await apiFetch("resources");

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe(`${process.env.NEXT_PUBLIC_DB_HOST}/resources`);
    const headers = options.headers as Headers;
    expect(headers.get("Authorization")).toBe("Bearer token-123");
    expect(headers.get("Content-Type")).toBe("application/json");
  });

  it("refreshes the token on 401 and retries with the new token", async () => {
    mockCookieGet((key) => {
      if (key === "auth_token") return "expired-token";
      if (key === "refresh_token") return "refresh-xyz";
      return undefined;
    });

    // 1ª llamada: 4000/resources -> 401; 2ª: refresh -> ok; 3ª: reintento -> 200
    fetchMock
      .mockResolvedValueOnce(jsonResponse(401, {}))
      .mockResolvedValueOnce(jsonResponse(200, { token: "new-token" }))
      .mockResolvedValueOnce(jsonResponse(200, { ok: true }));

    const res = await apiFetch("resources");

    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(res.status).toBe(200);
    // El reintento debe llevar el token nuevo
    const retryHeaders = fetchMock.mock.calls[2][1].headers as Headers;
    expect(retryHeaders.get("Authorization")).toBe("Bearer new-token");
    // Guarda el token refrescado en cookies
    expect(mockCookies.set).toHaveBeenCalledWith("auth_token", "new-token", { expires: 7 });
  });

  it("forces logout when the refresh token is also rejected", async () => {
    mockCookieGet((key) => {
      if (key === "auth_token") return "expired-token";
      if (key === "refresh_token") return "refresh-xyz";
      return undefined;
    });

    fetchMock
      .mockResolvedValueOnce(jsonResponse(401, {}))
      .mockResolvedValueOnce(jsonResponse(401, {}));

    await apiFetch("resources");

    // Limpia cookies y redirige
    expect(mockCookies.remove).toHaveBeenCalledWith("auth_token");
    expect(mockCookies.remove).toHaveBeenCalledWith("refresh_token");
    expect(window.location.href).toBe("/login?error=session_expired");
  });

  it("forces logout on 401 when there is no refresh token", async () => {
    mockCookieGet((key) =>
      key === "auth_token" ? "expired-token" : undefined,
    );
    fetchMock.mockResolvedValueOnce(jsonResponse(401, {}));

    await apiFetch("resources");

    expect(mockCookies.remove).toHaveBeenCalledWith("auth_token");
    expect(window.location.href).toBe("/login?error=session_expired");
  });
});
