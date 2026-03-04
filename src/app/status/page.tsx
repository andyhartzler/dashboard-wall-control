"use client";

import { useState, useEffect, useCallback } from "react";
import { useDashboard } from "@/components/DashboardProvider";
import {
  CheckCircle2,
  XCircle,
  RefreshCw,
  Clock,
  Cpu,
  HardDrive,
  MemoryStick,
  Thermometer,
  Wifi,
  WifiOff,
} from "lucide-react";

interface DataSource {
  id: string;
  name?: string;
  enabled?: boolean;
  interval?: number;
  last_update?: string;
  status?: string;
  error?: string;
}

export default function StatusPage() {
  const { connected, url, data } = useDashboard();
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);

  const systemHealth = data.system_health as Record<string, unknown> | undefined;

  const fetchSources = useCallback(async () => {
    if (!url) return;
    setLoading(true);
    try {
      const res = await fetch(`${url}/api/widgets`);
      if (res.ok) {
        const result = await res.json();
        const sources: DataSource[] = Array.isArray(result)
          ? result
          : Object.entries(result).map(([id, cfg]) => ({
              id,
              ...(typeof cfg === "object" && cfg !== null ? cfg : {}),
            } as DataSource));
        setDataSources(sources);
        setLastFetch(new Date());
      }
    } catch {
      // Connection error
    }
    setLoading(false);
  }, [url]);

  useEffect(() => {
    fetchSources();
  }, [fetchSources]);

  const activeSources = dataSources.filter((s) => s.enabled !== false);
  const errorSources = dataSources.filter(
    (s) => s.status === "error" || s.error
  );

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-text-primary">Status</h2>
        <p className="text-sm text-text-muted mt-1">
          System health and data source status
        </p>
      </div>

      {/* Connection Status */}
      <section className="glass-panel relative p-6 space-y-4">
        <h3 className="text-sm font-medium text-text-primary">Connection</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 py-3 px-4 rounded-xl bg-white/[0.02] border border-border-glass">
            {connected ? (
              <Wifi className="w-5 h-5 text-accent-green" />
            ) : (
              <WifiOff className="w-5 h-5 text-accent-red" />
            )}
            <div>
              <div className="text-xs text-text-muted">WebSocket</div>
              <div
                className={`text-sm font-medium ${
                  connected ? "text-accent-green" : "text-accent-red"
                }`}
              >
                {connected ? "Connected" : "Disconnected"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 py-3 px-4 rounded-xl bg-white/[0.02] border border-border-glass">
            <Clock className="w-5 h-5 text-accent-cyan" />
            <div>
              <div className="text-xs text-text-muted">Live Topics</div>
              <div className="text-sm font-medium text-text-primary">
                {Object.keys(data).length}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 py-3 px-4 rounded-xl bg-white/[0.02] border border-border-glass">
            <Clock className="w-5 h-5 text-accent-purple" />
            <div>
              <div className="text-xs text-text-muted">Backend URL</div>
              <div className="text-xs font-mono text-text-secondary truncate max-w-[180px]">
                {url || "Not set"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* System Health */}
      {systemHealth && (
        <section className="glass-panel relative p-6 space-y-4">
          <h3 className="text-sm font-medium text-text-primary">
            System Health (Pi)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {systemHealth.cpu_percent !== undefined && (
              <HealthGauge
                icon={Cpu}
                label="CPU"
                value={systemHealth.cpu_percent as number}
                unit="%"
                color="accent-blue"
              />
            )}
            {systemHealth.memory_percent !== undefined && (
              <HealthGauge
                icon={MemoryStick}
                label="Memory"
                value={systemHealth.memory_percent as number}
                unit="%"
                color="accent-purple"
              />
            )}
            {systemHealth.disk_percent !== undefined && (
              <HealthGauge
                icon={HardDrive}
                label="Disk"
                value={systemHealth.disk_percent as number}
                unit="%"
                color="accent-amber"
              />
            )}
            {systemHealth.temperature !== undefined && (
              <HealthGauge
                icon={Thermometer}
                label="Temp"
                value={systemHealth.temperature as number}
                unit="C"
                color="accent-red"
              />
            )}
          </div>
        </section>
      )}

      {/* Data Sources */}
      <section className="glass-panel relative p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-text-primary">
              Data Sources
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              {activeSources.length} active
              {errorSources.length > 0 &&
                `, ${errorSources.length} with errors`}
              {lastFetch && ` - fetched ${lastFetch.toLocaleTimeString()}`}
            </p>
          </div>
          <button
            onClick={fetchSources}
            disabled={loading}
            className="glass-btn text-xs flex items-center gap-1.5"
          >
            <RefreshCw
              className={`w-3 h-3 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>

        {dataSources.length === 0 ? (
          <p className="text-xs text-text-muted">
            {url
              ? "No data sources found. Make sure the backend is running."
              : "Connect to backend to view data sources."}
          </p>
        ) : (
          <div className="space-y-2">
            {dataSources.map((source) => {
              const hasData = data[source.id] !== undefined;
              const hasError = source.status === "error" || !!source.error;
              return (
                <div
                  key={source.id}
                  className="flex items-center justify-between py-2.5 px-4 rounded-lg bg-white/[0.02] border border-border-glass"
                >
                  <div className="flex items-center gap-3">
                    {hasError ? (
                      <XCircle className="w-4 h-4 text-accent-red" />
                    ) : hasData ? (
                      <CheckCircle2 className="w-4 h-4 text-accent-green" />
                    ) : (
                      <Clock className="w-4 h-4 text-text-muted" />
                    )}
                    <div>
                      <span className="text-xs font-medium text-text-secondary">
                        {(source.name || source.id).replace(/_/g, " ")}
                      </span>
                      {source.error && (
                        <p className="text-xs text-accent-red/70 mt-0.5">
                          {source.error}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {source.interval && (
                      <span className="text-xs text-text-muted">
                        {source.interval}s
                      </span>
                    )}
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        source.enabled === false
                          ? "bg-white/[0.05] text-text-muted"
                          : hasData
                          ? "bg-accent-green/10 text-accent-green"
                          : "bg-accent-amber/10 text-accent-amber"
                      }`}
                    >
                      {source.enabled === false
                        ? "disabled"
                        : hasData
                        ? "live"
                        : "waiting"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Active Topics (from WS) */}
      <section className="glass-panel relative p-6 space-y-4">
        <h3 className="text-sm font-medium text-text-primary">
          Active Topics (WebSocket)
        </h3>
        <div className="flex flex-wrap gap-2">
          {Object.keys(data).length === 0 ? (
            <p className="text-xs text-text-muted">No topics received yet</p>
          ) : (
            Object.keys(data)
              .sort()
              .map((topic) => (
                <span
                  key={topic}
                  className="text-xs px-2.5 py-1 rounded-lg bg-accent-blue/10 text-accent-blue border border-accent-blue/15"
                >
                  {topic}
                </span>
              ))
          )}
        </div>
      </section>
    </div>
  );
}

function HealthGauge({
  icon: Icon,
  label,
  value,
  unit,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  unit: string;
  color: string;
}) {
  const pct = unit === "%" ? value : Math.min((value / 100) * 100, 100);
  const isHigh = pct > 80;

  return (
    <div className="py-3 px-4 rounded-xl bg-white/[0.02] border border-border-glass space-y-2">
      <div className="flex items-center gap-2">
        <Icon className={`w-4 h-4 text-${color}`} />
        <span className="text-xs text-text-muted">{label}</span>
      </div>
      <div className={`text-lg font-light ${isHigh ? "text-accent-red" : "text-text-primary"}`}>
        {typeof value === "number" ? value.toFixed(1) : value}
        <span className="text-xs text-text-muted ml-0.5">{unit === "%" ? "%" : "\u00B0" + unit}</span>
      </div>
      <div className="w-full h-1 rounded-full bg-white/[0.05]">
        <div
          className={`h-full rounded-full transition-all ${
            isHigh ? "bg-accent-red" : `bg-${color}`
          }`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
    </div>
  );
}
