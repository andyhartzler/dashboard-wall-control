"use client";

import { registerWidget } from "./registry";

interface Quake { magnitude: number; place: string; time: number; depth: number; }

function magnitudeColor(mag: number): string {
  if (mag >= 7) return "var(--color-accent-red)";
  if (mag >= 5) return "var(--color-accent-orange)";
  return "var(--color-accent-green)";
}

function _timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function EarthquakeWidget({ data }: { data: Record<string, unknown> }) {
  const quakes = (data.quakes as Quake[]) || [];
  if (quakes.length === 0) return <div className="metric-label" style={{ padding: 8 }}>No recent M4.5+ earthquakes</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0, height: "100%", overflowY: "auto" }}>
      {quakes.slice(0, 8).map((q, i) => {
        const color = magnitudeColor(q.magnitude);
        const isLarge = q.magnitude >= 6;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", borderBottom: "1px solid rgba(80, 120, 200, 0.06)" }}>
            <div style={{ fontSize: 17, fontWeight: 600, color, minWidth: 48, textAlign: "center", fontVariantNumeric: "tabular-nums", fontFamily: "var(--font-mono)", textShadow: isLarge ? `0 0 12px ${color}` : "none" }}>
              {q.magnitude.toFixed(1)}
            </div>
            <div style={{ width: 3, alignSelf: "stretch", borderRadius: 2, background: color, opacity: 0.7 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: "var(--color-t-primary)", fontFamily: "var(--font-sans)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{q.place}</div>
              <div style={{ fontSize: 10, color: "var(--color-t-muted)", fontWeight: 400, marginTop: 2, letterSpacing: "0.02em" }}>
                {q.depth.toFixed(0)} km deep &middot; {_timeAgo(q.time)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

registerWidget("earthquake", { title: "Earthquakes", topic: "earthquakes", component: EarthquakeWidget, defaultSize: { width: 3, height: 2 } });
