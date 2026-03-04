"use client";

import { useDashboard } from "@/components/DashboardProvider";
import { TopicCard } from "@/components/TopicCard";
import { MonitorOff } from "lucide-react";

const TOPIC_ORDER = [
  "weather",
  "stocks",
  "crypto",
  "news_kc",
  "news_world",
  "world_news",
  "air_traffic",
  "earthquakes",
  "sports",
  "prediction_markets",
  "sun",
  "calendar",
  "reminders",
  "conflict",
  "faa_delays",
  "wildfire",
  "webcams",
  "system_health",
];

export default function DashboardPage() {
  const { data, connected } = useDashboard();

  const topics = Object.keys(data);
  // Sort: known topics first in order, then any unknown topics alphabetically
  const sortedTopics = [
    ...TOPIC_ORDER.filter((t) => topics.includes(t)),
    ...topics.filter((t) => !TOPIC_ORDER.includes(t)).sort(),
  ];

  if (!connected && sortedTopics.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 rounded-2xl bg-bg-card border border-border-glass flex items-center justify-center mb-4">
          <MonitorOff className="w-8 h-8 text-text-muted" />
        </div>
        <h2 className="text-lg font-medium text-text-primary mb-2">
          No Data Available
        </h2>
        <p className="text-sm text-text-muted max-w-md">
          Connect to your dashboard backend to see live data. Use the connection
          settings to configure the backend URL.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-text-primary">
          Live Dashboard
        </h2>
        <p className="text-sm text-text-muted mt-1">
          {sortedTopics.length} active topic{sortedTopics.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sortedTopics.map((topic) => (
          <TopicCard key={topic} topic={topic} data={data[topic]} />
        ))}
      </div>
    </div>
  );
}
