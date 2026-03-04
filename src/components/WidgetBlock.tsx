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
      return "";
    case "weather": {
      const temp = data.temp as number | undefined;
      const desc = data.description as string | undefined;
      if (temp !== undefined) return `${Math.round(temp)}° ${desc || ""}`.trim();
      return null;
    }
    case "stocks": {
      const quotes = data.quotes as Array<{ name: string; change_pct: number }> | undefined;
      if (quotes?.length) {
        return quotes.slice(0, 2).map((s) => `${s.name.split(" ")[0]} ${s.change_pct >= 0 ? "+" : ""}${s.change_pct.toFixed(1)}%`).join("  ");
      }
      return null;
    }
    case "crypto": {
      const coins = data.coins as Array<{ name: string; change_24h: number }> | undefined;
      if (coins?.length) {
        return coins.slice(0, 2).map((c) => `${c.name.slice(0, 3)} ${c.change_24h >= 0 ? "+" : ""}${c.change_24h.toFixed(1)}%`).join("  ");
      }
      return null;
    }
    case "news_kc":
    case "news_world": {
      const articles = data.articles as Array<{ title: string }> | undefined;
      if (articles?.length) return articles[0].title.slice(0, 50);
      return null;
    }
    case "earthquake": {
      const quakes = data.quakes as Array<{ magnitude: number; place: string }> | undefined;
      if (quakes?.length) return `M${quakes[0].magnitude} ${quakes[0].place?.slice(0, 25) || ""}`;
      return null;
    }
    case "sports": {
      const scores = data.scores as Array<{ league: string; home_team: string; away_team: string }> | undefined;
      if (scores?.length) return `${scores[0].league}: ${scores[0].away_team} @ ${scores[0].home_team}`.slice(0, 40);
      return null;
    }
    case "prediction": {
      const markets = data.markets as Array<{ title: string }> | undefined;
      if (markets?.length) return markets[0].title?.slice(0, 40) || null;
      return null;
    }
    case "moon": {
      const phase = data.moon_phase as string | undefined;
      const illum = data.moon_illumination as number | undefined;
      if (phase) return `${phase}${illum !== undefined ? ` ${Math.round(illum * 100)}%` : ""}`;
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
