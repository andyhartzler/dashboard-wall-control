"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { useDashboard } from "@/components/DashboardProvider";
import { WidgetFrame } from "@/components/WidgetFrame";
import { WIDGET_REGISTRY } from "@/widgets";
import { registerWidget } from "@/widgets/registry";
import type { WidgetPlacement } from "@/lib/widget-meta";

// Dynamically import Leaflet + HLS widgets (they access window/document)
const DynamicAirTraffic = dynamic(() => import("@/widgets/AirTrafficWidget").then(() => {
  const entry = WIDGET_REGISTRY["air_traffic"];
  return { default: entry?.component || (() => null) };
}), { ssr: false });

const DynamicWeatherRadar = dynamic(() => import("@/widgets/WeatherRadarWidget").then(() => {
  const entry = WIDGET_REGISTRY["weather_radar"];
  return { default: entry?.component || (() => null) };
}), { ssr: false });

const DynamicWorldMap = dynamic(() => import("@/widgets/WorldMapWidget").then(() => {
  const entry = WIDGET_REGISTRY["world_map"];
  return { default: entry?.component || (() => null) };
}), { ssr: false });

const DynamicWebcam = dynamic(() => import("@/widgets/WebcamWidget").then(() => {
  const entry = WIDGET_REGISTRY["webcam"];
  return { default: entry?.component || (() => null) };
}), { ssr: false });

// Map of widget IDs that need dynamic loading
const DYNAMIC_WIDGETS: Record<string, typeof DynamicAirTraffic> = {
  air_traffic: DynamicAirTraffic,
  weather_radar: DynamicWeatherRadar,
  world_map: DynamicWorldMap,
  webcam: DynamicWebcam,
};

// Topic → widget ID mapping for data lookup
const TOPIC_MAP: Record<string, string> = {};

// Build topic map from registry entries
function getTopicForWidget(widgetId: string): string {
  // Check registry first
  const entry = WIDGET_REGISTRY[widgetId];
  if (entry) return entry.topic;

  // Fallback map for dynamic widgets not yet loaded
  const fallback: Record<string, string> = {
    air_traffic: "air_traffic",
    weather_radar: "weather_radar",
    world_map: "earthquakes",
    webcam: "webcams",
  };
  return fallback[widgetId] || widgetId;
}

export function TVMirror() {
  const { connected, data, layout } = useDashboard();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      // The grid is 12 cols, scale to fit mobile width
      setScale(width > 0 ? width / 1920 : 1);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  if (!connected) {
    return (
      <div className="tv-mirror-container">
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 8 }}>
          <span style={{ fontSize: 28, opacity: 0.3 }}>📺</span>
          <span style={{ fontSize: 11, color: "var(--color-t-muted)", fontWeight: 500 }}>Connecting to TV...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="tv-mirror-container" ref={wrapperRef}>
      <div className="tv-mirror-grid">
        {layout.map((placement: WidgetPlacement) => {
          const widgetId = placement.widget;
          const topic = getTopicForWidget(widgetId);
          const widgetData = (data[topic] as Record<string, unknown>) || {};

          // Get the component — either from dynamic map or registry
          const DynamicComponent = DYNAMIC_WIDGETS[widgetId];
          const registryEntry = WIDGET_REGISTRY[widgetId];
          const Component = DynamicComponent || registryEntry?.component;

          if (!Component) {
            // Unknown widget — show placeholder
            return (
              <WidgetFrame
                key={widgetId}
                title={widgetId}
                col={placement.col}
                row={placement.row}
                width={placement.width}
                height={placement.height}
              >
                <div className="metric-label" style={{ padding: 8 }}>
                  {widgetId}
                </div>
              </WidgetFrame>
            );
          }

          const title = registryEntry?.title || widgetId;

          return (
            <WidgetFrame
              key={widgetId}
              title={title}
              col={placement.col}
              row={placement.row}
              width={placement.width}
              height={placement.height}
            >
              <Component data={widgetData} />
            </WidgetFrame>
          );
        })}
      </div>
    </div>
  );
}
