"use client";

import { useEffect, useRef } from "react";
import { useMapKit } from "@/hooks/useMapKit";
import { registerWidget } from "./registry";

interface Quake {
  magnitude: number;
  place: string;
  time: number;
  lat: number;
  lon: number;
  depth: number;
}

function magnitudeColor(mag: number): string {
  if (mag >= 7) return "#FF5252";
  if (mag >= 6) return "#FFB300";
  if (mag >= 5) return "#FDE68A";
  return "#00E676";
}

function magnitudeSize(mag: number): number {
  return Math.max(8, mag * 5);
}

function createQuakeElement(mag: number): HTMLDivElement {
  const el = document.createElement("div");
  const color = magnitudeColor(mag);
  const size = magnitudeSize(mag);
  el.style.cssText = `
    width: ${size}px;
    height: ${size}px;
    border-radius: 50%;
    background: ${color};
    opacity: 0.6;
    border: 1.5px solid ${color};
    box-shadow: 0 0 ${size / 2}px ${color}60;
    cursor: default;
  `;
  return el;
}

function WorldMapWidget({ data }: { data: Record<string, unknown> }) {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const annotationsRef = useRef<any[]>([]);
  const { map, ready } = useMapKit(containerRef, {
    center: { lat: 20, lon: 0 },
    cameraDistance: 20000000,
    colorScheme: "dark",
    mapType: "mutedStandard",
    isScrollEnabled: true,
    isZoomEnabled: true,
  });

  const quakes = (data.quakes as Quake[]) || [];

  useEffect(() => {
    if (!map || !ready) return;
    const mk = (window as any).mapkit;
    if (!mk) return;

    if (annotationsRef.current.length > 0) {
      map.removeAnnotations(annotationsRef.current);
      annotationsRef.current = [];
    }

    const newAnnotations: any[] = [];
    for (const q of quakes) {
      const timeStr = new Date(q.time).toLocaleString();
      const annotation = new mk.Annotation(
        new mk.Coordinate(q.lat, q.lon),
        () => createQuakeElement(q.magnitude),
        {
          title: `M${q.magnitude.toFixed(1)}`,
          subtitle: `${q.place}\nDepth: ${q.depth.toFixed(0)} km\n${timeStr}`,
          animates: false,
        }
      );
      newAnnotations.push(annotation);
    }

    if (newAnnotations.length > 0) {
      map.addAnnotations(newAnnotations);
      annotationsRef.current = newAnnotations;
    }
  }, [quakes, map, ready]);

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
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--color-accent-red)" }}>
          {quakes.length}
        </span>
        <span>earthquakes (M4.5+)</span>
      </div>
    </div>
  );
}

registerWidget("world_map", {
  title: "World Seismic Map",
  topic: "earthquakes",
  component: WorldMapWidget,
  defaultSize: { width: 6, height: 4 },
});

export default WorldMapWidget;
