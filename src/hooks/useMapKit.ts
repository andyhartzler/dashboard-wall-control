"use client";

import { useEffect, useRef, useState } from "react";
import { useDashboard } from "@/components/DashboardProvider";
import { fetchMapKitToken } from "@/lib/mapkit-token";

const MAPKIT_CDN = "https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.core.js";

let _initPromise: Promise<void> | null = null;
let _initialized = false;

function loadScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src*="mapkit"]`)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = MAPKIT_CDN;
    script.crossOrigin = "anonymous";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load MapKit JS"));
    document.head.appendChild(script);
  });
}

async function initMapKit(backendUrl: string, password: string): Promise<void> {
  if (_initialized) return;
  if (_initPromise) return _initPromise;

  _initPromise = (async () => {
    await loadScript();
    const mk = (window as any).mapkit;
    await new Promise<void>((resolve) => {
      mk.init({
        authorizationCallback: async (done: (token: string) => void) => {
          try {
            const token = await fetchMapKitToken(backendUrl, password);
            done(token);
          } catch (e) {
            console.error("MapKit auth failed:", e);
          }
        },
      });
      setTimeout(resolve, 100);
    });
    // Load the map library (required for MapKit JS 5.x modular loading)
    if (typeof mk.importLibrary === 'function') {
      await mk.importLibrary('map');
    }
    _initialized = true;
  })();

  return _initPromise;
}

export function useMapKit(
  containerRef: React.RefObject<HTMLDivElement | null>,
  options?: {
    center?: { lat: number; lon: number };
    cameraDistance?: number;
    colorScheme?: "dark" | "light";
    mapType?: "standard" | "mutedStandard" | "satellite" | "hybrid";
    isScrollEnabled?: boolean;
    isZoomEnabled?: boolean;
    isRotationEnabled?: boolean;
  }
) {
  const mapRef = useRef<any>(null);
  const [ready, setReady] = useState(false);
  const { url, password } = useDashboard();

  const center = options?.center ?? { lat: 39.0997, lon: -94.5786 };
  const cameraDistance = options?.cameraDistance ?? 100000;
  const colorScheme = options?.colorScheme ?? "dark";
  const mapType = options?.mapType ?? "mutedStandard";

  useEffect(() => {
    if (!containerRef.current || !url) return;

    let destroyed = false;
    const container = containerRef.current;
    const mk = (window as any).mapkit;

    initMapKit(url, password).then(() => {
      if (destroyed || !container) return;
      const mk = (window as any).mapkit;

      const mapTypeMap: Record<string, string> = {
        standard: mk.Map.MapTypes.Standard,
        mutedStandard: mk.Map.MapTypes.MutedStandard,
        satellite: mk.Map.MapTypes.Satellite,
        hybrid: mk.Map.MapTypes.Hybrid,
      };

      const map = new mk.Map(container, {
        center: new mk.Coordinate(center.lat, center.lon),
        cameraDistance,
        colorScheme: colorScheme === "dark" ? mk.Map.ColorSchemes.Dark : mk.Map.ColorSchemes.Light,
        mapType: mapTypeMap[mapType] || mk.Map.MapTypes.MutedStandard,
        showsCompass: mk.FeatureVisibility.Hidden,
        showsZoomControl: false,
        showsMapTypeControl: false,
        showsScale: mk.FeatureVisibility.Hidden,
        isScrollEnabled: options?.isScrollEnabled ?? true,
        isZoomEnabled: options?.isZoomEnabled ?? true,
        isRotationEnabled: options?.isRotationEnabled ?? false,
      });

      mapRef.current = map;
      setReady(true);
    }).catch((err) => {
      console.error("Failed to initialize MapKit:", err);
    });

    return () => {
      destroyed = true;
      if (mapRef.current) {
        mapRef.current.destroy();
        mapRef.current = null;
      }
      setReady(false);
    };
  }, [url]);

  return { map: mapRef.current, ready };
}

export default useMapKit;
