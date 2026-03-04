"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { registerWidget } from "./registry";

interface Quake { magnitude: number; place: string; time: number; lat: number; lon: number; depth: number; }

function magnitudeColor(mag: number): string {
  if (mag >= 7) return "#FF5252";
  if (mag >= 6) return "#FFB300";
  if (mag >= 5) return "#FDE68A";
  return "#00E676";
}

function magnitudeRadius(mag: number): number {
  return Math.max(4, mag * 3);
}

function WorldMapWidget({ data }: { data: Record<string, unknown> }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<L.CircleMarker[]>([]);
  const quakes = (data.quakes as Quake[]) || [];

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;
    const map = L.map(mapRef.current, { center: [20, 0], zoom: 2, zoomControl: false, attributionControl: false, worldCopyJump: true });
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", { maxZoom: 19 }).addTo(map);
    mapInstance.current = map;
    return () => { map.remove(); mapInstance.current = null; };
  }, []);

  useEffect(() => {
    if (!mapInstance.current) return;
    for (const marker of markersRef.current) marker.remove();
    markersRef.current = [];
    for (const q of quakes) {
      const color = magnitudeColor(q.magnitude);
      const radius = magnitudeRadius(q.magnitude);
      const marker = L.circleMarker([q.lat, q.lon], { radius, color, fillColor: color, fillOpacity: 0.5, weight: 1.5, opacity: 0.8 });
      marker.bindTooltip(
        `<strong>M${q.magnitude.toFixed(1)}</strong><br/>${q.place}<br/>Depth: ${q.depth.toFixed(0)} km<br/>${new Date(q.time).toLocaleString()}`,
        { className: "glass-tooltip" }
      );
      marker.addTo(mapInstance.current!);
      markersRef.current.push(marker);
    }
  }, [quakes]);

  return (
    <div style={{ position: "relative", height: "100%" }}>
      <div ref={mapRef} style={{ height: "100%", borderRadius: 12, overflow: "hidden" }} />
      <div className="glass-badge" style={{ position: "absolute", bottom: 10, right: 10, zIndex: 1000, display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--color-accent-red)" }}>{quakes.length}</span>
        <span>earthquakes (M4.5+)</span>
      </div>
    </div>
  );
}

registerWidget("world_map", { title: "World Seismic Map", topic: "earthquakes", component: WorldMapWidget, defaultSize: { width: 6, height: 4 } });
