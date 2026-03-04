"use client";

let _tokenCache: { token: string; expires: number } | null = null;

export async function fetchMapKitToken(
  backendUrl: string,
  password: string
): Promise<string> {
  const now = Date.now();
  if (_tokenCache && _tokenCache.expires > now) {
    return _tokenCache.token;
  }

  const resp = await fetch(`${backendUrl}/api/apple/mapkit-token`, {
    headers: {
      "x-dashboard-password": password,
      "ngrok-skip-browser-warning": "1",
    },
  });

  if (!resp.ok) {
    throw new Error(`MapKit token fetch failed: ${resp.status}`);
  }

  const data = await resp.json();
  _tokenCache = { token: data.token, expires: now + 23 * 3600 * 1000 };
  return data.token;
}
