"use client";

import { useEffect, useRef } from "react";
import { useMapKit } from "@/hooks/useMapKit";
import { registerWidget } from "./registry";

interface Aircraft {
  icao24: string;
  callsign: string;
  lat: number;
  lon: number;
  altitude: number | null;
  heading: number | null;
  velocity: number | null;
  on_ground: boolean;
}

const KC_CENTER = { lat: 39.0997, lon: -94.5786 };

function altitudeColor(alt: number | null): string {
  if (alt === null) return "#666";
  if (alt < 1000) return "#FF5252";
  if (alt < 3000) return "#FFB300";
  if (alt < 6000) return "#00E676";
  if (alt < 10000) return "#18FFFF";
  return "#4C9FFF";
}

function createPlaneElement(heading: number | null, alt: number | null): HTMLDivElement {
  const el = document.createElement("div");
  const rotation = heading ?? 0;
  const color = altitudeColor(alt);
  el.style.cssText = `
    transform: rotate(${rotation}deg);
    color: ${color};
    font-size: 18px;
    filter: drop-shadow(0 0 4px ${color}80);
    line-height: 1;
    cursor: default;
  `;
  el.textContent = "\u2708";
  return el;
}

function AirTrafficWidget({ data }: { data: Record<string, unknown> }) {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const annotationsRef = useRef<Map<string, any>>(new Map());
  const { map, ready } = useMapKit(containerRef, {
    center: KC_CENTER,
    cameraDistance: 120000,
    colorScheme: "dark",
    mapType: "mutedStandard",
  });

  const aircraft = (data.aircraft as Aircraft[]) || [];
  const count = data.count as number || 0;

  useEffect(() => {
    if (!map || !ready) return;
    const mk = (window as any).mapkit;
    if (!mk) return;

    const currentIds = new Set<string>();

    for (const ac of aircraft) {
      currentIds.add(ac.icao24);
      const existing = annotationsRef.current.get(ac.icao24);

      if (existing) {
        existing.coordinate = new mk.Coordinate(ac.lat, ac.lon);
        if (existing.element) {
          const rotation = ac.heading ?? 0;
          const color = altitudeColor(ac.altitude);
          existing.element.style.cssText = `
            transform: rotate(${rotation}deg);
            color: ${color};
            font-size: 18px;
            filter: drop-shadow(0 0 4px ${color}80);
            line-height: 1;
            cursor: default;
          `;
        }
      } else {
        const annotation = new mk.Annotation(
          new mk.Coordinate(ac.lat, ac.lon),
          () => createPlaneElement(ac.heading, ac.altitude),
          {
            title: ac.callsign || ac.icao24,
            subtitle: `Alt: ${ac.altitude ? Math.round(ac.altitude * 3.281) + " ft" : "N/A"} | Spd: ${ac.velocity || "N/A"} kts`,
            animates: false,
          }
        );
        map.addAnnotation(annotation);
        annotationsRef.current.set(ac.icao24, annotation);
      }
    }

    for (const [id, annotation] of annotationsRef.current) {
      if (!currentIds.has(id)) {
        map.removeAnnotation(annotation);
        annotationsRef.current.delete(id);
      }
    }
  }, [aircraft, map, ready]);

  return (
    <div style={{ position: "relative", height: "100%" }}>
      <div ref={containerRef} style={{
        height: "100%",
        borderRadius: 8,
        overflow: "hidden",
      }} />
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
          background: "var(--color-accent-green)",
          boxShadow: "0 0 8px var(--color-accent-green)",
        }} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}>{count}</span> aircraft
      </div>
    </div>
  );
}

registerWidget("air_traffic", {
  title: "Air Traffic",
  topic: "air_traffic",
  component: AirTrafficWidget,
  defaultSize: { width: 6, height: 4 },
});

export default AirTrafficWidget;
