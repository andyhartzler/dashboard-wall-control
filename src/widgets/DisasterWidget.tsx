"use client";

import { registerWidget } from "./registry";

interface GroundStop { airport: string; reason: string; end_time: string; }
interface GroundDelay { airport: string; reason: string; avg_delay: string; max_delay: string; }
interface Delay { airport: string; type: string; reason: string; detail: string; }
interface Closure { airport: string; reason: string; }

function DisasterWidget({ data }: { data: Record<string, unknown> }) {
  const groundStops = (data.ground_stops as GroundStop[]) || [];
  const groundDelays = (data.ground_delays as GroundDelay[]) || [];
  const delays = (data.delays as Delay[]) || [];
  const closures = (data.closures as Closure[]) || [];
  const totalIssues = (data.total_issues as number) || 0;

  if (totalIssues === 0) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 6 }}>
        <div style={{ fontSize: 28, fontWeight: 300, color: "var(--color-accent-green)", fontFamily: "var(--font-mono)", textShadow: "0 0 16px rgba(0, 230, 118, 0.4)" }}>ALL CLEAR</div>
        <div className="metric-label">No FAA delays or ground stops</div>
      </div>
    );
  }

  const renderItem = (airport: string, label: string, detail: string, color: string, key: string) => (
    <div key={key} style={{ display: "flex", gap: 10, padding: "6px 0", borderBottom: "1px solid rgba(80, 120, 200, 0.06)" }}>
      <div style={{ width: 3, alignSelf: "stretch", borderRadius: 2, background: color, opacity: 0.8, boxShadow: `0 0 4px ${color}` }} />
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color, fontFamily: "var(--font-mono)", letterSpacing: "0.03em", textShadow: `0 0 8px ${color}` }}>
          {airport} <span style={{ fontFamily: "var(--font-sans)", fontWeight: 500 }}>{label}</span>
        </div>
        <div style={{ fontSize: 10, color: "var(--color-t-muted)", marginTop: 2, fontFamily: "var(--font-sans)" }}>{detail}</div>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0, height: "100%", overflowY: "auto" }}>
      {closures.map((c, i) => renderItem(c.airport, "CLOSED", c.reason, "var(--color-accent-red)", `c-${i}`))}
      {groundStops.map((gs, i) => renderItem(gs.airport, "Ground Stop", `${gs.reason}${gs.end_time ? ` · Until ${gs.end_time}` : ""}`, "var(--color-accent-orange)", `gs-${i}`))}
      {groundDelays.map((gd, i) => renderItem(gd.airport, "Ground Delay", `${gd.reason}${gd.avg_delay ? ` · Avg ${gd.avg_delay}` : ""}`, "var(--color-accent-orange)", `gd-${i}`))}
      {delays.map((d, i) => renderItem(d.airport, d.type, `${d.reason}${d.detail ? ` · ${d.detail}` : ""}`, "var(--color-accent-blue)", `d-${i}`))}
    </div>
  );
}

registerWidget("disaster", { title: "FAA Status", topic: "faa_delays", component: DisasterWidget, defaultSize: { width: 3, height: 2 } });
