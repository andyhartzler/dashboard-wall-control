"use client";

let _tokenCache: { token: string; expires: number } | null = null;

/** Called by useDashboardWS when the backend sends a MapKit token via WebSocket */
export function setMapKitToken(token: string) {
  _tokenCache = { token, expires: Date.now() + 23 * 3600 * 1000 };
}

export async function fetchMapKitToken(
  backendUrl: string,
  password: string
): Promise<string> {
  // Poll cache for up to 15s waiting for WebSocket to deliver the token
  for (let attempt = 0; attempt < 15; attempt++) {
    if (_tokenCache && _tokenCache.expires > Date.now()) {
      return _tokenCache.token;
    }
    if (attempt > 0) {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  // Last resort: try HTTP fetch (may fail due to CORS with ngrok)
  try {
    const resp = await fetch(
      `${backendUrl}/api/apple/mapkit-token?password=${encodeURIComponent(password)}`,
    );
    if (resp.ok) {
      const data = await resp.json();
      _tokenCache = { token: data.token, expires: Date.now() + 23 * 3600 * 1000 };
      return data.token;
    }
  } catch {
    // CORS or network error
  }

  throw new Error("MapKit token not available");
}
