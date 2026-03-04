"use client";

import {
  Cloud,
  Plane,
  Newspaper,
  Globe,
  Bitcoin,
  TrendingUp,
  Activity,
  Trophy,
  Camera,
  Sun,
  Calendar,
  Bell,
  BarChart3,
  Swords,
  PlaneTakeoff,
  Flame,
  Cpu,
  HelpCircle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

interface TopicCardProps {
  topic: string;
  data: unknown;
}

const topicIcons: Record<string, React.ElementType> = {
  weather: Cloud,
  air_traffic: Plane,
  news_kc: Newspaper,
  news_world: Globe,
  crypto: Bitcoin,
  stocks: TrendingUp,
  earthquakes: Activity,
  sports: Trophy,
  webcams: Camera,
  sun: Sun,
  calendar: Calendar,
  reminders: Bell,
  prediction_markets: BarChart3,
  conflict: Swords,
  faa_delays: PlaneTakeoff,
  wildfire: Flame,
  system_health: Cpu,
  world_news: Globe,
};

const topicColors: Record<string, string> = {
  weather: "text-accent-cyan",
  air_traffic: "text-accent-blue",
  news_kc: "text-accent-amber",
  news_world: "text-accent-purple",
  crypto: "text-accent-amber",
  stocks: "text-accent-green",
  earthquakes: "text-accent-red",
  sports: "text-accent-green",
  webcams: "text-accent-cyan",
  sun: "text-accent-amber",
  calendar: "text-accent-blue",
  reminders: "text-accent-purple",
  prediction_markets: "text-accent-cyan",
  conflict: "text-accent-red",
  faa_delays: "text-accent-amber",
  wildfire: "text-accent-red",
  system_health: "text-accent-green",
  world_news: "text-accent-purple",
};

function formatTopicName(topic: string): string {
  return topic
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function renderWeather(data: any) {
  if (!data) return null;
  return (
    <div className="space-y-2">
      {data.temperature !== undefined && (
        <div className="text-2xl font-light text-text-primary">
          {Math.round(data.temperature)}&deg;{data.unit || "F"}
        </div>
      )}
      {data.description && (
        <div className="text-sm text-text-secondary capitalize">
          {data.description}
        </div>
      )}
      <div className="flex gap-4 text-xs text-text-muted">
        {data.humidity !== undefined && <span>Humidity: {data.humidity}%</span>}
        {data.wind_speed !== undefined && (
          <span>Wind: {Math.round(data.wind_speed)} mph</span>
        )}
      </div>
    </div>
  );
}

function renderStocks(data: any) {
  const items = Array.isArray(data) ? data : data?.stocks || data?.items || [];
  if (!items.length) return <div className="text-xs text-text-muted">No data</div>;
  return (
    <div className="space-y-1.5">
      {items.slice(0, 6).map((item: any, i: number) => (
        <div key={i} className="flex items-center justify-between text-xs">
          <span className="text-text-secondary font-medium">
            {item.symbol || item.name}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-text-primary">
              ${typeof item.price === "number" ? item.price.toFixed(2) : item.price}
            </span>
            {item.change !== undefined && (
              <span
                className={`flex items-center gap-0.5 ${
                  item.change >= 0 ? "text-accent-green" : "text-accent-red"
                }`}
              >
                {item.change >= 0 ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {Math.abs(item.change_percent || item.change).toFixed(2)}%
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function renderCrypto(data: any) {
  const items = Array.isArray(data) ? data : data?.coins || data?.items || [];
  if (!items.length) return <div className="text-xs text-text-muted">No data</div>;
  return (
    <div className="space-y-1.5">
      {items.slice(0, 6).map((item: any, i: number) => (
        <div key={i} className="flex items-center justify-between text-xs">
          <span className="text-text-secondary font-medium">
            {item.symbol || item.name}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-text-primary">
              ${typeof item.price === "number"
                ? item.price.toLocaleString(undefined, { maximumFractionDigits: 2 })
                : item.price}
            </span>
            {item.change_24h !== undefined && (
              <span
                className={`flex items-center gap-0.5 ${
                  item.change_24h >= 0 ? "text-accent-green" : "text-accent-red"
                }`}
              >
                {item.change_24h >= 0 ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {Math.abs(item.change_24h).toFixed(2)}%
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function renderNews(data: any) {
  const articles = Array.isArray(data)
    ? data
    : data?.articles || data?.items || [];
  return (
    <div className="space-y-2">
      <div className="text-xs text-text-muted">
        {articles.length} article{articles.length !== 1 ? "s" : ""}
      </div>
      {articles.slice(0, 3).map((a: any, i: number) => (
        <div
          key={i}
          className="text-xs text-text-secondary leading-relaxed line-clamp-2"
        >
          {a.title || a.headline}
        </div>
      ))}
    </div>
  );
}

function renderAirTraffic(data: any) {
  const count =
    data?.count ?? data?.aircraft_count ?? (Array.isArray(data) ? data.length : null);
  return (
    <div className="space-y-2">
      {count !== null && (
        <div className="text-2xl font-light text-text-primary">{count}</div>
      )}
      <div className="text-xs text-text-muted">Aircraft in range</div>
    </div>
  );
}

function renderEarthquakes(data: any) {
  const quakes = Array.isArray(data)
    ? data
    : data?.earthquakes || data?.features || [];
  const maxMag = quakes.reduce(
    (max: number, q: any) =>
      Math.max(max, q.magnitude ?? q.properties?.mag ?? 0),
    0
  );
  return (
    <div className="space-y-2">
      <div className="flex items-baseline gap-3">
        <div className="text-2xl font-light text-text-primary">
          {quakes.length}
        </div>
        <span className="text-xs text-text-muted">events</span>
      </div>
      {maxMag > 0 && (
        <div className="text-xs text-text-secondary">
          Max magnitude: <span className="text-accent-amber">{maxMag.toFixed(1)}</span>
        </div>
      )}
    </div>
  );
}

function renderPredictionMarkets(data: any) {
  const markets = Array.isArray(data) ? data : data?.markets || data?.items || [];
  if (!markets.length) return <div className="text-xs text-text-muted">No data</div>;
  return (
    <div className="space-y-2">
      {markets.slice(0, 3).map((m: any, i: number) => (
        <div key={i} className="space-y-1">
          <div className="text-xs text-text-secondary line-clamp-1">
            {m.title || m.question}
          </div>
          {(m.probability !== undefined || m.yes_price !== undefined) && (
            <div className="text-sm font-medium text-accent-cyan">
              {((m.probability ?? m.yes_price) * 100).toFixed(0)}%
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function renderSystemHealth(data: any) {
  if (!data) return null;
  return (
    <div className="space-y-2">
      {data.cpu_percent !== undefined && (
        <div className="flex justify-between text-xs">
          <span className="text-text-muted">CPU</span>
          <span className="text-text-secondary">{data.cpu_percent}%</span>
        </div>
      )}
      {data.memory_percent !== undefined && (
        <div className="flex justify-between text-xs">
          <span className="text-text-muted">Memory</span>
          <span className="text-text-secondary">{data.memory_percent}%</span>
        </div>
      )}
      {data.disk_percent !== undefined && (
        <div className="flex justify-between text-xs">
          <span className="text-text-muted">Disk</span>
          <span className="text-text-secondary">{data.disk_percent}%</span>
        </div>
      )}
      {data.temperature !== undefined && (
        <div className="flex justify-between text-xs">
          <span className="text-text-muted">Temp</span>
          <span className="text-text-secondary">{data.temperature}&deg;C</span>
        </div>
      )}
    </div>
  );
}

function renderSports(data: any) {
  const games = Array.isArray(data) ? data : data?.games || data?.items || [];
  if (!games.length) return <div className="text-xs text-text-muted">No live games</div>;
  return (
    <div className="space-y-2">
      {games.slice(0, 3).map((g: any, i: number) => (
        <div key={i} className="text-xs text-text-secondary">
          {g.away_team || g.away} {g.away_score ?? ""} @ {g.home_team || g.home}{" "}
          {g.home_score ?? ""}
          {g.status && (
            <span className="text-text-muted ml-1">({g.status})</span>
          )}
        </div>
      ))}
    </div>
  );
}

function renderSun(data: any) {
  if (!data) return null;
  return (
    <div className="space-y-1.5 text-xs">
      {data.sunrise && (
        <div className="flex justify-between">
          <span className="text-text-muted">Sunrise</span>
          <span className="text-accent-amber">{data.sunrise}</span>
        </div>
      )}
      {data.sunset && (
        <div className="flex justify-between">
          <span className="text-text-muted">Sunset</span>
          <span className="text-accent-purple">{data.sunset}</span>
        </div>
      )}
      {data.day_length && (
        <div className="flex justify-between">
          <span className="text-text-muted">Day length</span>
          <span className="text-text-secondary">{data.day_length}</span>
        </div>
      )}
    </div>
  );
}

function renderCalendar(data: any) {
  const events = Array.isArray(data) ? data : data?.events || [];
  if (!events.length) return <div className="text-xs text-text-muted">No upcoming events</div>;
  return (
    <div className="space-y-2">
      {events.slice(0, 3).map((e: any, i: number) => (
        <div key={i} className="text-xs">
          <div className="text-text-secondary">{e.title || e.summary}</div>
          {e.start && (
            <div className="text-text-muted">{e.start}</div>
          )}
        </div>
      ))}
    </div>
  );
}

function renderDefault(data: any) {
  const str = JSON.stringify(data, null, 2);
  const truncated = str.length > 400 ? str.slice(0, 400) + "..." : str;
  return (
    <pre className="text-xs text-text-muted whitespace-pre-wrap break-words font-mono leading-relaxed max-h-40 overflow-y-auto">
      {truncated}
    </pre>
  );
}
/* eslint-enable @typescript-eslint/no-explicit-any */

function renderTopicContent(topic: string, data: unknown) {
  switch (topic) {
    case "weather":
      return renderWeather(data);
    case "stocks":
      return renderStocks(data);
    case "crypto":
      return renderCrypto(data);
    case "news_kc":
    case "news_world":
    case "world_news":
      return renderNews(data);
    case "air_traffic":
      return renderAirTraffic(data);
    case "earthquakes":
      return renderEarthquakes(data);
    case "prediction_markets":
      return renderPredictionMarkets(data);
    case "system_health":
      return renderSystemHealth(data);
    case "sports":
      return renderSports(data);
    case "sun":
      return renderSun(data);
    case "calendar":
      return renderCalendar(data);
    default:
      return renderDefault(data);
  }
}

export function TopicCard({ topic, data }: TopicCardProps) {
  const Icon = topicIcons[topic] || HelpCircle;
  const color = topicColors[topic] || "text-text-secondary";

  return (
    <div className="glass-panel relative p-5 flex flex-col gap-3">
      <div className="flex items-center gap-2.5">
        <Icon className={`w-4 h-4 ${color}`} />
        <h3 className="text-sm font-medium text-text-primary">
          {formatTopicName(topic)}
        </h3>
      </div>
      <div className="flex-1">{renderTopicContent(topic, data)}</div>
    </div>
  );
}
