"use client";

import { useDashboard } from "@/components/DashboardProvider";

export default function StatusPage() {
  const { connected, data } = useDashboard();
  const systemHealth = data.system_health as Record<string, unknown> | undefined;
  const topicCount = Object.keys(data).length;

  return (
    <div className="page-content">
      <h1 className="text-[20px] font-600 text-t-primary mb-6 animate-in">Status</h1>

      {/* Connection */}
      <section className="mb-6 animate-in stagger-1">
        <div className="card flex items-center gap-4">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              background: connected ? "var(--color-green-dim)" : "var(--color-red-dim)",
            }}
          >
            <span
              className="w-3 h-3 rounded-full"
              style={{ background: connected ? "var(--color-green)" : "var(--color-red)" }}
            />
          </div>
          <div>
            <p className="text-[15px] font-500 text-t-primary">
              {connected ? "Connected" : "Disconnected"}
            </p>
            <p className="text-[12px] text-t-muted mt-0.5">
              {connected
                ? `Receiving ${topicCount} topic${topicCount !== 1 ? "s" : ""} via WebSocket`
                : "Attempting to reconnect..."}
            </p>
          </div>
        </div>
      </section>

      {/* System Health */}
      {systemHealth && (
        <section className="mb-6 animate-in stagger-2">
          <h2 className="text-[13px] font-600 text-t-secondary uppercase tracking-wider mb-3">Raspberry Pi</h2>
          <div className="grid grid-cols-2 gap-3">
            {systemHealth.cpu_percent !== undefined && (
              <MetricCard
                label="CPU"
                value={`${Number(systemHealth.cpu_percent).toFixed(0)}%`}
                color="var(--color-blue)"
                pct={Number(systemHealth.cpu_percent)}
              />
            )}
            {systemHealth.memory_percent !== undefined && (
              <MetricCard
                label="Memory"
                value={`${Number(systemHealth.memory_percent).toFixed(0)}%`}
                color="var(--color-purple)"
                pct={Number(systemHealth.memory_percent)}
              />
            )}
            {systemHealth.temperature !== undefined && (
              <MetricCard
                label="Temp"
                value={`${Number(systemHealth.temperature).toFixed(0)}°C`}
                color={Number(systemHealth.temperature) > 70 ? "var(--color-red)" : "var(--color-amber)"}
                pct={Math.min(Number(systemHealth.temperature), 100)}
              />
            )}
            {systemHealth.disk_percent !== undefined && (
              <MetricCard
                label="Disk"
                value={`${Number(systemHealth.disk_percent).toFixed(0)}%`}
                color="var(--color-cyan)"
                pct={Number(systemHealth.disk_percent)}
              />
            )}
          </div>
        </section>
      )}

      {/* Active Topics */}
      <section className="animate-in stagger-3">
        <h2 className="text-[13px] font-600 text-t-secondary uppercase tracking-wider mb-3">
          Active Topics
        </h2>
        <div className="card !p-3">
          {topicCount === 0 ? (
            <p className="text-[13px] text-t-muted p-1">No topics received</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {Object.keys(data).sort().map((topic) => (
                <span
                  key={topic}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-500"
                  style={{
                    background: "var(--color-surface-2)",
                    color: "var(--color-t-secondary)",
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full live-dot" />
                  {topic.replace(/_/g, " ")}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function MetricCard({ label, value, color, pct }: {
  label: string;
  value: string;
  color: string;
  pct: number;
}) {
  return (
    <div className="card">
      <p className="text-[11px] text-t-muted font-500 uppercase tracking-wider mb-2">{label}</p>
      <p className="text-[22px] font-300 text-t-primary leading-none mb-3" style={{ fontVariantNumeric: "tabular-nums" }}>
        {value}
      </p>
      <div className="w-full h-1 rounded-full" style={{ background: "var(--color-surface-3)" }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.min(pct, 100)}%`, background: color }}
        />
      </div>
    </div>
  );
}
