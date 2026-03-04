"use client";

import { useDashboard } from "@/components/DashboardProvider";
import { WidgetBlock } from "@/components/WidgetBlock";
import { WIDGET_META } from "@/lib/widget-meta";

// Map widget IDs to their backend data topics
const WIDGET_TOPICS: Record<string, string> = {
  clock: "clock",
  weather: "weather",
  calendar: "calendar",
  reminders: "reminders",
  air_traffic: "air_traffic",
  weather_radar: "weather_radar",
  world_map: "world_map",
  webcam: "webcams",
  stocks: "stocks",
  crypto: "crypto",
  news_kc: "news_kc",
  news_world: "news_world",
  earthquake: "earthquakes",
  sun: "sun",
  moon: "moon",
  sports: "sports",
  prediction: "prediction_markets",
  trending: "trending",
  disaster: "disaster",
  conflict: "conflict",
  smart_home: "smart_home",
  system_health: "system_health",
};

export function TVMirror() {
  const { layout, data } = useDashboard();

  if (layout.length === 0) {
    return (
      <div className="tv-mirror-container">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            gap: 8,
          }}
        >
          <span style={{ fontSize: 28, opacity: 0.3 }}>📺</span>
          <span
            style={{
              fontSize: 11,
              color: "var(--color-t-muted)",
              fontWeight: 500,
            }}
          >
            No widgets placed
          </span>
          <span
            style={{
              fontSize: 10,
              color: "var(--color-t-muted)",
              opacity: 0.6,
            }}
          >
            Tap the edit button to add widgets
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="tv-mirror-container">
      <div className="tv-mirror-grid">
        {layout.map((placement) => {
          const topic = WIDGET_TOPICS[placement.widget];
          const widgetData = topic ? (data[topic] as Record<string, unknown>) : undefined;
          const meta = WIDGET_META[placement.widget];
          if (!meta) return null;

          return (
            <div
              key={placement.widget}
              style={{
                gridColumn: `${placement.col} / span ${placement.width}`,
                gridRow: `${placement.row} / span ${placement.height}`,
              }}
            >
              <WidgetBlock
                widgetId={placement.widget}
                data={widgetData}
                compact={placement.width <= 2 && placement.height <= 1}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
