"use client";

import { registerWidget } from "./registry";

interface Entity { entity_id: string; friendly_name: string; state: string; icon: string; }

function SmartHomeWidget({ data }: { data: Record<string, unknown> }) {
  const entities = (data.entities as Entity[]) || [];
  if (entities.length === 0) return <div className="metric-label" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>Connect Home Assistant</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0, height: "100%", overflowY: "auto" }}>
      {entities.map((entity, i) => {
        const isOn = entity.state === "on";
        return (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: "1px solid rgba(80, 120, 200, 0.06)" }}>
            <div style={{ fontSize: 13, color: "var(--color-t-primary)", fontWeight: 400, fontFamily: "var(--font-sans)" }}>{entity.friendly_name}</div>
            <div style={{
              fontSize: 10, fontWeight: 700, fontFamily: "var(--font-mono)",
              color: isOn ? "var(--color-accent-green)" : "var(--color-t-muted)",
              textTransform: "uppercase", letterSpacing: "0.06em",
              background: isOn ? "rgba(0, 230, 118, 0.12)" : "transparent",
              padding: "3px 8px", borderRadius: 6,
              textShadow: isOn ? "0 0 6px rgba(0, 230, 118, 0.4)" : "none",
            }}>{entity.state}</div>
          </div>
        );
      })}
    </div>
  );
}

registerWidget("smart_home", { title: "Smart Home", topic: "smart_home", component: SmartHomeWidget, defaultSize: { width: 3, height: 4 } });
