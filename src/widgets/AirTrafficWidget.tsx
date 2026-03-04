"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { registerWidget } from "./registry";

interface Aircraft {
  icao24: string; callsign: string; lat: number; lon: number;
  altitude: number | null; heading: number | null; velocity: number | null; on_ground: boolean;
}

const KC_CENTER: [number, number] = [39.0997, -94.5786];

function altitudeColor(alt: number | null): string {
  if (alt === null) return "#666";
  if (alt < 1000) return "#FF5252";
  if (alt < 3000) return "#FFB300";
  if (alt < 6000) return "#00E676";
  if (alt < 10000) return "#18FFFF";
  return "#4C9FFF";
}

function createPlaneIcon(heading: number | null, alt: number | null): L.DivIcon {
  const rotation = heading ?? 0;
  const color = altitudeColor(alt);
  return L.divIcon({
    className: "",
    html: `<div style="transform:rotate(${rotation}deg);color:${color};font-size:16px;filter:drop-shadow(0 0 4px ${color}80);line-height:1;">\u2708</div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
}

function AirTrafficWidget({ data }: { data: Record<string, unknown> }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const aircraft = (data.aircraft as Aircraft[]) || [];
  const count = (data.count as number) || 0;

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;
    const map = L.map(mapRef.current, { center: KC_CENTER, zoom: 10, zoomControl: false, attributionControl: false });
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", { maxZoom: 19 }).addTo(map);
    mapInstance.current = map;
    return () => { map.remove(); mapInstance.current = null; };
  }, []);

  useEffect(() => {
    if (!mapInstance.current) return;
    const currentIds = new Set<string>();
    for (const ac of aircraft) {
      currentIds.add(ac.icao24);
      const existing = markersRef.current.get(ac.icao24);
      if (existing) {
        existing.setLatLng([ac.lat, ac.lon]);
        existing.setIcon(createPlaneIcon(ac.heading, ac.altitude));
      } else {
        const marker = L.marker([ac.lat, ac.lon], { icon: createPlaneIcon(ac.heading, ac.altitude) });
        marker.bindTooltip(
          `${ac.callsign || ac.icao24}<br/>Alt: ${ac.altitude ? Math.round(ac.altitude * 3.281) + " ft" : "N/A"}<br/>Spd: ${ac.velocity || "N/A"} kts`,
          { className: "glass-tooltip" }
        );
        marker.addTo(mapInstance.current!);
        markersRef.current.set(ac.icao24, marker);
      }
    }
    for (const [id, marker] of markersRef.current) {
      if (!currentIds.has(id)) { marker.remove(); markersRef.current.delete(id); }
    }
  }, [aircraft]);

  return (
    <div style={{ position: "relative", height: "100%" }}>
      <div ref={mapRef} style={{ height: "100%", borderRadius: 12, overflow: "hidden" }} />
      <div className="glass-badge" style={{ position: "absolute", bottom: 10, right: 10, zIndex: 1000, display: "flex", alignItems: "center", gap: 6 }}>
        <div className="pulse-live" style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--color-accent-green)", boxShadow: "0 0 8px var(--color-accent-green)" }} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}>{count}</span> aircraft
      </div>
    </div>
  );
}

registerWidget("air_traffic", { title: "Air Traffic", topic: "air_traffic", component: AirTrafficWidget, defaultSize: { width: 6, height: 4 } });
