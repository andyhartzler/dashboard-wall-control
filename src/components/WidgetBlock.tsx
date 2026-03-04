"use client";

import { WIDGET_META } from "@/lib/widget-meta";

interface WidgetBlockProps {
  widgetId: string;
  data?: Record<string, unknown>;
  selected?: boolean;
  onTap?: () => void;
  compact?: boolean;
}

function formatDataSummary(widgetId: string, data?: Record<string, unknown>): string | null {
  if (!data || Object.keys(data).length === 0) return null;

  switch (widgetId) {
    case "clock":
      return ""; // Clock is self-explanatory
    case "weather": {
      const temp = data.temp as number | undefined;
      const desc = data.description as string | undefined;
      if (temp !== undefined) return `${Math.round(temp)}° ${desc || ""}`.trim();
      return null;
    }
    case "stocks": {
      const items = data.items as Array<{ symbol: string; price: number; change_pct: number }> | undefined;
      if (items?.length) {
        return items.slice(0, 2).map((s) => `${s.symbol} ${s.change_pct >= 0 ? "+" : ""}${s.change_pct.toFixed(1)}%`).join("  ");
      }
      return null;
    }
    case "crypto": {
      const coins = data.items as Array<{ symbol: string; price: number; change_pct: number }> | undefined;
      if (coins?.length) {
        return coins.slice(0, 2).map((c) => `${c.symbol} ${c.change_pct >= 0 ? "+" : ""}${c.change_pct.toFixed(1)}%`).join("  ");
      }
      return null;
    }
    case "news_kc":
    case "news_world": {
      const articles = data.items as Array<{ title: string }> | undefined;
      if (articles?.length) return articles[0].title.slice(0, 50);
      return null;
    }
    case "earthquake": {
      const quakes = data.items as Array<{ magnitude: number; location: string }> | undefined;
      if (quakes?.length) return `M${quakes[0].magnitude} ${quakes[0].location?.slice(0, 25) || ""}`;
      return null;
    }
    case "sports": {
      const games = data.items as Array<{ summary: string }> | undefined;
      if (games?.length) return games[0].summary?.slice(0, 40) || null;
      return null;
    }
    case "calendar": {
      const events = data.items as Array<{ title: string }> | undefined;
      if (events?.length) return events[0].title?.slice(0, 35) || null;
      return null;
    }
    case "sun": {
      const sunrise = data.sunrise as string | undefined;
      const sunset = data.sunset as string | undefined;
      if (sunrise && sunset) return `↑${sunrise} ↓${sunset}`;
      return null;
    }
    case "system_health": {
      const cpu = data.cpu_percent as number | undefined;
      const mem = data.memory_percent as number | undefined;
      if (cpu !== undefined && mem !== undefined) return `CPU ${cpu}% | RAM ${mem}%`;
      return null;
    }
    default:
      return null;
  }
}

export function WidgetBlock({ widgetId, data, selected, onTap, compact }: WidgetBlockProps) {
  const meta = WIDGET_META[widgetId];
  if (!meta) return null;

  const summary = formatDataSummary(widgetId, data);

  return (
    <button
      onClick={onTap}
      className="widget-block"
      style={{
        "--widget-accent": meta.accent,
        "--widget-accent-dim": `${meta.accent}20`,
        outline: selected ? `1px solid ${meta.accent}` : undefined,
        outlineOffset: -1,
      } as React.CSSProperties}
    >
      <span className="widget-block-icon">{meta.icon}</span>
      <span className="widget-block-title">{meta.title}</span>
      {!compact && summary && (
        <span
          style={{
            fontSize: 7,
            lineHeight: 1.2,
            color: "var(--color-t-muted)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "90%",
            fontFamily: "var(--font-mono)",
          }}
        >
          {summary}
        </span>
      )}
    </button>
  );
}
