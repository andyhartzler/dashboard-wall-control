"use client";

import type React from "react";
import { registerWidget } from "./registry";

function MoonPhaseWidget({ data }: { data: Record<string, unknown> }) {
  const moonPhase = data.moon_phase as string | undefined;
  const moonIllumination = data.moon_illumination as number | undefined;
  const phaseValue = data.moon_phase_value as number | undefined;

  if (!moonPhase) return <div className="metric-label" style={{ padding: 8 }}>Awaiting moon data...</div>;

  const illuminationPct = moonIllumination !== undefined ? Math.round(moonIllumination * 100) : 0;
  const phase = phaseValue ?? 0;

  let shadowStyle: React.CSSProperties;
  if (phase < 0.5) {
    const offset = Math.round((1 - phase * 2) * 100);
    shadowStyle = { background: `linear-gradient(to right, rgba(10,14,26,0.9) ${offset}%, transparent ${offset}%)` };
  } else {
    const offset = Math.round((phase - 0.5) * 2 * 100);
    shadowStyle = { background: `linear-gradient(to right, transparent ${offset}%, rgba(10,14,26,0.9) ${offset}%)` };
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, height: "100%" }}>
      <div style={{ position: "relative", width: 72, height: 72, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #e8e6c8, #c4c098, #969270)", boxShadow: "0 0 30px rgba(232, 230, 200, 0.1), 0 0 60px rgba(179, 136, 255, 0.06)", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", ...shadowStyle }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 65% 60%, rgba(0,0,0,0.1) 0%, transparent 30%)" }} />
      </div>
      <div style={{ fontSize: 14, fontWeight: 500, color: "var(--color-t-primary)", textAlign: "center", fontFamily: "var(--font-sans)" }}>{moonPhase}</div>
      <div style={{ fontSize: 12, color: "var(--color-accent-purple)", fontWeight: 500, fontFamily: "var(--font-mono)", textShadow: "0 0 8px rgba(179, 136, 255, 0.4)" }}>{illuminationPct}%</div>
    </div>
  );
}

registerWidget("moon", { title: "Moon Phase", topic: "sun", component: MoonPhaseWidget, defaultSize: { width: 3, height: 2 } });
