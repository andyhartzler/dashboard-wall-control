"use client";

import { useEffect, useRef, useState } from "react";
import { useMapKit } from "@/hooks/useMapKit";
import { registerWidget } from "./registry";

const KC_CENTER = { lat: 39.0997, lon: -94.5786 };
const RAINVIEWER_API = "https://api.rainviewer.com/public/weather-maps.json";

function WeatherRadarWidget(_props: { data: Record<string, unknown> }) {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const overlayRef = useRef<any>(null);
  const [radarTimestamp, setRadarTimestamp] = useState<string>("");
  const { map, ready } = useMapKit(containerRef, {
    center: KC_CENTER,
    cameraDistance: 500000,
    colorScheme: "dark",
    mapType: "mutedStandard",
  });

  useEffect(() => {
    if (!map || !ready) return;
    const mk = (window as any).mapkit;
    if (!mk) return;

    const fetchRadar = async () => {
      try {
        const resp = await fetch(RAINVIEWER_API);
        const data = await resp.json();
        const radarFrames = data?.radar?.past || [];
        if (radarFrames.length === 0) return;

        const latestFrame = radarFrames[radarFrames.length - 1];
        const ts = latestFrame.path;

        if (overlayRef.current) {
          map.removeTileOverlay(overlayRef.current);
        }

        const overlay = new mk.TileOverlay(
          (x: number, y: number, z: number, _scale: number) =>
            `https://tilecache.rainviewer.com${ts}/256/${z}/${x}/${y}/2/1_1.png`,
          { opacity: 0.6 }
        );
        map.addTileOverlay(overlay);
        overlayRef.current = overlay;

        const date = new Date(latestFrame.time * 1000);
        setRadarTimestamp(date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }));
      } catch {
        // Silently fail on radar fetch errors
      }
    };

    fetchRadar();
    const interval = setInterval(fetchRadar, 120000);
    return () => clearInterval(interval);
  }, [map, ready]);

  return (
    <div style={{ position: "relative", height: "100%" }}>
      <div ref={containerRef} style={{
        height: "100%",
        borderRadius: 8,
        overflow: "hidden",
      }} />
      {radarTimestamp && (
        <div className="glass-badge" style={{
          position: "absolute",
          bottom: 10,
          right: 10,
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}>
          <div className="pulse-live" style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: "var(--color-accent-cyan)",
            boxShadow: "0 0 8px var(--color-accent-cyan)",
          }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}>
            {radarTimestamp}
          </span>
        </div>
      )}
      <div className="glass-badge" style={{
        position: "absolute",
        bottom: 10,
        left: 10,
        zIndex: 1000,
        display: "flex",
        gap: 5,
        alignItems: "center",
        fontSize: 9,
        color: "var(--color-t-muted)",
        letterSpacing: "0.04em",
      }}>
        <span>LIGHT</span>
        <div style={{
          width: 50,
          height: 4,
          borderRadius: 2,
          background: "linear-gradient(to right, #00E676, #FFB300, #FF5252, #B388FF)",
          opacity: 0.8,
        }} />
        <span>HEAVY</span>
      </div>
    </div>
  );
}

registerWidget("weather_radar", {
  title: "Weather Radar",
  topic: "weather_radar",
  component: WeatherRadarWidget,
  defaultSize: { width: 6, height: 4 },
});

export default WeatherRadarWidget;
