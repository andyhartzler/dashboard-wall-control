"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { registerWidget } from "./registry";

const KC_CENTER: [number, number] = [39.0997, -94.5786];
const RAINVIEWER_API = "https://api.rainviewer.com/public/weather-maps.json";

function WeatherRadarWidget(_props: { data: Record<string, unknown> }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const radarLayer = useRef<L.TileLayer | null>(null);
  const [radarTimestamp, setRadarTimestamp] = useState<string>("");

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;
    const map = L.map(mapRef.current, { center: KC_CENTER, zoom: 7, zoomControl: false, attributionControl: false });
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", { maxZoom: 19 }).addTo(map);
    mapInstance.current = map;
    return () => { map.remove(); mapInstance.current = null; };
  }, []);

  useEffect(() => {
    if (!mapInstance.current) return;
    const fetchRadar = async () => {
      try {
        const resp = await fetch(RAINVIEWER_API);
        const data = await resp.json();
        const radarFrames = data?.radar?.past || [];
        if (radarFrames.length === 0) return;
        const latestFrame = radarFrames[radarFrames.length - 1];
        if (radarLayer.current) radarLayer.current.remove();
        const layer = L.tileLayer(`https://tilecache.rainviewer.com${latestFrame.path}/256/{z}/{x}/{y}/2/1_1.png`, { opacity: 0.6, maxZoom: 19 });
        layer.addTo(mapInstance.current!);
        radarLayer.current = layer;
        setRadarTimestamp(new Date(latestFrame.time * 1000).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }));
      } catch { /* silent */ }
    };
    fetchRadar();
    const interval = setInterval(fetchRadar, 120000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: "relative", height: "100%" }}>
      <div ref={mapRef} style={{ height: "100%", borderRadius: 12, overflow: "hidden" }} />
      {radarTimestamp && (
        <div className="glass-badge" style={{ position: "absolute", bottom: 10, right: 10, zIndex: 1000, display: "flex", alignItems: "center", gap: 6 }}>
          <div className="pulse-live" style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--color-accent-cyan)", boxShadow: "0 0 8px var(--color-accent-cyan)" }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}>{radarTimestamp}</span>
        </div>
      )}
      <div className="glass-badge" style={{ position: "absolute", bottom: 10, left: 10, zIndex: 1000, display: "flex", gap: 5, alignItems: "center", fontSize: 9, color: "var(--color-t-muted)", letterSpacing: "0.04em" }}>
        <span>LIGHT</span>
        <div style={{ width: 50, height: 4, borderRadius: 2, background: "linear-gradient(to right, #00E676, #FFB300, #FF5252, #B388FF)", opacity: 0.8 }} />
        <span>HEAVY</span>
      </div>
    </div>
  );
}

registerWidget("weather_radar", { title: "Weather Radar", topic: "weather_radar", component: WeatherRadarWidget, defaultSize: { width: 6, height: 4 } });
