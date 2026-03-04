"use client";

import { registerWidget } from "./registry";

function ConflictWidget({ data }: { data: Record<string, unknown> }) {
  const events = (data.events as unknown[]) || [];
  if (events.length === 0) return <div className="metric-label" style={{ padding: 8 }}>Awaiting conflict data...</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0, height: "100%", overflowY: "auto" }}>
      {(events as Array<Record<string, unknown>>).slice(0, 10).map((ev, i) => (
        <div key={i} style={{ display: "flex", gap: 10, padding: "7px 0", borderBottom: "1px solid rgba(80, 120, 200, 0.06)" }}>
          <div style={{ width: 3, alignSelf: "stretch", borderRadius: 2, background: "var(--color-accent-red)", opacity: 0.7, boxShadow: "0 0 4px rgba(255, 82, 82, 0.4)" }} />
          <div style={{ fontSize: 12, fontWeight: 500, color: "var(--color-t-primary)", fontFamily: "var(--font-sans)", lineHeight: 1.4 }}>
            {String(ev.name || ev.title || ev.description || "Event")}
          </div>
        </div>
      ))}
    </div>
  );
}

registerWidget("conflict", { title: "Conflicts", topic: "conflict", component: ConflictWidget, defaultSize: { width: 3, height: 4 } });
