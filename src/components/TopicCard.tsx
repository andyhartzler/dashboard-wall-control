"use client";

interface TopicCardProps {
  topic: string;
  data: unknown;
  index: number;
}

const topicMeta: Record<string, { label: string; color: string; icon: string }> = {
  weather: { label: "Weather", color: "#64d2ff", icon: "cloud" },
  stocks: { label: "Markets", color: "#30d158", icon: "trending" },
  crypto: { label: "Crypto", color: "#ff9f0a", icon: "bitcoin" },
  news_kc: { label: "KC News", color: "#ff9f0a", icon: "newspaper" },
  news_world: { label: "World News", color: "#bf5af2", icon: "globe" },
  world_news: { label: "Headlines", color: "#bf5af2", icon: "globe" },
  air_traffic: { label: "Air Traffic", color: "#0a84ff", icon: "plane" },
  earthquakes: { label: "Earthquakes", color: "#ff453a", icon: "activity" },
  sports: { label: "Sports", color: "#30d158", icon: "trophy" },
  webcams: { label: "Webcams", color: "#64d2ff", icon: "camera" },
  sun: { label: "Sun & Moon", color: "#ff9f0a", icon: "sun" },
  calendar: { label: "Calendar", color: "#0a84ff", icon: "calendar" },
  reminders: { label: "Reminders", color: "#bf5af2", icon: "bell" },
  prediction_markets: { label: "Predictions", color: "#64d2ff", icon: "chart" },
  conflict: { label: "Conflicts", color: "#ff453a", icon: "alert" },
  faa_delays: { label: "FAA Status", color: "#ff9f0a", icon: "plane" },
  wildfire: { label: "Wildfires", color: "#ff453a", icon: "flame" },
  system_health: { label: "System", color: "#30d158", icon: "cpu" },
};

/* eslint-disable @typescript-eslint/no-explicit-any */
function getMetric(topic: string, data: any): { value: string; sub: string } | null {
  if (!data) return null;

  switch (topic) {
    case "weather":
      if (data.temperature !== undefined) return {
        value: `${Math.round(data.temperature)}°`,
        sub: data.description || ""
      };
      break;
    case "air_traffic":
      return {
        value: String(data.count ?? data.aircraft_count ?? "—"),
        sub: "aircraft"
      };
    case "earthquakes": {
      const q = Array.isArray(data) ? data : data?.earthquakes || data?.features || [];
      return { value: String(q.length), sub: "events" };
    }
    case "stocks":
    case "crypto": {
      const items = Array.isArray(data) ? data : data?.stocks || data?.coins || data?.items || [];
      return { value: String(items.length), sub: "tracked" };
    }
    case "news_kc":
    case "news_world":
    case "world_news": {
      const articles = Array.isArray(data) ? data : data?.articles || data?.items || [];
      return { value: String(articles.length), sub: "articles" };
    }
    case "prediction_markets": {
      const markets = Array.isArray(data) ? data : data?.markets || [];
      return { value: String(markets.length), sub: "markets" };
    }
    case "system_health":
      if (data.temperature !== undefined) return {
        value: `${Math.round(data.temperature)}°`,
        sub: `CPU ${data.cpu_percent || 0}%`
      };
      break;
    case "sun":
      if (data.sunset) return { value: data.sunset, sub: "sunset" };
      break;
    case "faa_delays":
      return {
        value: String(data.total_issues ?? 0),
        sub: data.total_issues === 0 ? "all clear" : "delays"
      };
    case "wildfire": {
      const local = data.local_fires || [];
      return { value: String(local.length), sub: "nearby" };
    }
    case "conflict": {
      const events = Array.isArray(data) ? data : data?.events || [];
      return { value: String(events.length), sub: "events" };
    }
    case "sports": {
      const games = Array.isArray(data) ? data : data?.games || [];
      return { value: String(games.length), sub: "games" };
    }
    case "calendar":
    case "reminders": {
      const items = Array.isArray(data) ? data : data?.events || data?.items || [];
      return { value: String(items.length), sub: "items" };
    }
  }
  return null;
}

function getDetailRows(topic: string, data: any): string[] {
  if (!data) return [];
  switch (topic) {
    case "news_kc":
    case "news_world":
    case "world_news": {
      const articles = Array.isArray(data) ? data : data?.articles || data?.items || [];
      return articles.slice(0, 3).map((a: any) => a.title || a.headline || "");
    }
    case "stocks": {
      const items = Array.isArray(data) ? data : data?.stocks || data?.items || [];
      return items.slice(0, 4).map((s: any) => {
        const change = s.change_percent ?? s.change ?? 0;
        const sign = change >= 0 ? "+" : "";
        return `${s.symbol}  $${typeof s.price === "number" ? s.price.toFixed(2) : s.price}  ${sign}${Number(change).toFixed(2)}%`;
      });
    }
    case "crypto": {
      const items = Array.isArray(data) ? data : data?.coins || data?.items || [];
      return items.slice(0, 4).map((c: any) => {
        const change = c.change_24h ?? 0;
        const sign = change >= 0 ? "+" : "";
        return `${c.symbol}  $${typeof c.price === "number" ? c.price.toLocaleString(undefined, { maximumFractionDigits: 0 }) : c.price}  ${sign}${Number(change).toFixed(1)}%`;
      });
    }
    case "prediction_markets": {
      const markets = Array.isArray(data) ? data : data?.markets || [];
      return markets.slice(0, 3).map((m: any) => {
        const prob = m.outcomes?.[0]?.probability ?? (m.probability ? m.probability * 100 : 0);
        return `${Math.round(prob)}%  ${m.title || m.question}`;
      });
    }
    case "sports": {
      const games = Array.isArray(data) ? data : data?.games || [];
      return games.slice(0, 3).map((g: any) =>
        `${g.away_team || g.away} ${g.away_score ?? ""} @ ${g.home_team || g.home} ${g.home_score ?? ""}`.trim()
      );
    }
    default:
      return [];
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export function TopicCard({ topic, data, index }: TopicCardProps) {
  const meta = topicMeta[topic] || { label: topic.replace(/_/g, " "), color: "#8e8e93", icon: "help" };
  const metric = getMetric(topic, data);
  const details = getDetailRows(topic, data);
  const stagger = index < 6 ? `stagger-${index + 1}` : "";

  return (
    <div className={`card animate-in ${stagger}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: meta.color }}
          />
          <span className="text-[13px] font-medium" style={{ color: meta.color }}>
            {meta.label}
          </span>
        </div>
        <div className="live-dot" />
      </div>

      {metric && (
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-[28px] font-300 tracking-tight text-t-primary leading-none">
            {metric.value}
          </span>
          <span className="text-[11px] text-t-muted font-medium uppercase tracking-wider">
            {metric.sub}
          </span>
        </div>
      )}

      {details.length > 0 && (
        <div className="mt-3 space-y-1.5">
          {details.map((row, i) => (
            <p key={i} className="text-[12px] text-t-secondary leading-snug truncate">
              {row}
            </p>
          ))}
        </div>
      )}

      {!metric && details.length === 0 && (
        <p className="text-[12px] text-t-muted">Receiving data...</p>
      )}
    </div>
  );
}
