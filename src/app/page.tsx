"use client";

import { useDashboard } from "@/components/DashboardProvider";
import { TopicCard } from "@/components/TopicCard";

const TOPIC_ORDER = [
  "weather", "stocks", "crypto", "news_kc", "news_world", "world_news",
  "air_traffic", "earthquakes", "sports", "prediction_markets", "sun",
  "calendar", "reminders", "conflict", "faa_delays", "wildfire",
  "webcams", "system_health",
];

export default function DashboardPage() {
  const { data, connected } = useDashboard();

  const topics = Object.keys(data);
  const sortedTopics = [
    ...TOPIC_ORDER.filter((t) => topics.includes(t)),
    ...topics.filter((t) => !TOPIC_ORDER.includes(t)).sort(),
  ];

  return (
    <div className="page-content">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-[20px] font-600 text-t-primary">Live</h1>
          <p className="text-[12px] text-t-muted mt-0.5">
            {sortedTopics.length} source{sortedTopics.length !== 1 ? "s" : ""} active
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${connected ? "live-dot" : ""}`}
            style={{ background: connected ? "#30d158" : "#ff453a" }}
          />
          <span className="text-[11px] font-medium" style={{ color: connected ? "#30d158" : "#ff453a" }}>
            {connected ? "Live" : "Offline"}
          </span>
        </div>
      </div>

      {sortedTopics.length === 0 ? (
        <div className="flex flex-col items-center justify-center pt-32 text-center animate-in">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: "var(--color-surface-1)", border: "1px solid var(--color-border)" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#48484a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <p className="text-[14px] text-t-secondary mb-1">Waiting for data</p>
          <p className="text-[12px] text-t-muted">Connecting to dashboard backend...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {sortedTopics.map((topic, i) => (
            <TopicCard key={topic} topic={topic} data={data[topic]} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
