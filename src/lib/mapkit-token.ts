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
  const now = Date.now();
  if (_tokenCache && _tokenCache.expires > now) {
    return _tokenCache.token;
  }

  // Try HTTP fetch as fallback (may fail due to CORS with ngrok)
  try {
    const resp = await fetch(
      `${backendUrl}/api/apple/mapkit-token?password=${encodeURIComponent(password)}`,
      { headers: { "ngrok-skip-browser-warning": "1" } }
    );
    if (resp.ok) {
      const data = await resp.json();
      _tokenCache = { token: data.token, expires: now + 23 * 3600 * 1000 };
      return data.token;
    }
  } catch {
    // CORS or network error — wait for WebSocket to provide token
  }

  throw new Error("MapKit token not available yet");
}
