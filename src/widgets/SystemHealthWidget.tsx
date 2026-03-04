"use client";

import { registerWidget } from "./registry";

function barColor(pct: number): string {
  if (pct >= 90) return "var(--color-accent-red)";
  if (pct >= 70) return "var(--color-accent-orange)";
  return "var(--color-accent-cyan)";
}

function tempColor(temp: number): string {
  if (temp >= 80) return "var(--color-accent-red)";
  if (temp >= 65) return "var(--color-accent-orange)";
  return "var(--color-accent-green)";
}

function SystemHealthWidget({ data }: { data: Record<string, unknown> }) {
  const cpuPct = data.cpu_percent as number | undefined;
  const memPct = data.memory_percent as number | undefined;
  const diskPct = data.disk_percent as number | undefined;
  const cpuTemp = data.cpu_temp as number | null | undefined;

  if (cpuPct === undefined) return <div className="metric-label" style={{ padding: 8 }}>Awaiting system data...</div>;

  const metrics = [
    { label: "CPU", value: cpuPct ?? 0 },
    { label: "MEM", value: memPct ?? 0 },
    { label: "DISK", value: diskPct ?? 0 },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 8, height: "100%" }}>
      {metrics.map((m) => {
        const color = barColor(m.value);
        return (
          <div key={m.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className="metric-label" style={{ minWidth: 30, textAlign: "right" }}>{m.label}</span>
            <div className="progress-bar" style={{ flex: 1 }}>
              <div className="progress-bar-fill" style={{ width: `${m.value}%`, background: color, boxShadow: m.value >= 70 ? `0 0 8px ${color}` : "none" }} />
            </div>
            <span style={{ fontSize: 11, fontVariantNumeric: "tabular-nums", fontWeight: 600, fontFamily: "var(--font-mono)", color, minWidth: 32, textAlign: "right", textShadow: m.value >= 70 ? `0 0 8px ${color}` : "none" }}>
              {Math.round(m.value)}%
            </span>
          </div>
        );
      })}
      {cpuTemp !== undefined && cpuTemp !== null && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
          <span className="metric-label" style={{ minWidth: 30, textAlign: "right" }}>TEMP</span>
          <span style={{ fontSize: 14, fontWeight: 400, color: tempColor(cpuTemp), fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums", textShadow: `0 0 8px ${tempColor(cpuTemp)}` }}>
            {cpuTemp}&deg;C
          </span>
        </div>
      )}
    </div>
  );
}

registerWidget("system_health", { title: "System", topic: "system_health", component: SystemHealthWidget, defaultSize: { width: 2, height: 1 } });
