"use client";

import { useState, useEffect } from "react";
import { registerWidget } from "./registry";

function formatCountdown(ms: number): string {
  if (ms < 0) return "--:--";
  const totalMin = Math.floor(ms / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return `${h}h ${m.toString().padStart(2, "0")}m`;
}

function SunWidget({ data }: { data: Record<string, unknown> }) {
  const sunrise = data.sunrise as string | undefined;
  const sunset = data.sunset as string | undefined;
  const moonPhase = data.moon_phase as string | undefined;
  const moonIllumination = data.moon_illumination as number | undefined;
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  if (!sunrise || !sunset) return <div className="metric-label" style={{ padding: 8 }}>Awaiting sun data...</div>;

  const [riseH, riseM] = sunrise.split(":").map(Number);
  const [setH, setM] = sunset.split(":").map(Number);
  const riseDate = new Date(now); riseDate.setUTCHours(riseH, riseM, 0, 0);
  const setDate = new Date(now); setDate.setUTCHours(setH, setM, 0, 0);
  const isAfterSunrise = now.getTime() > riseDate.getTime();
  const isAfterSunset = now.getTime() > setDate.getTime();

  let nextEvent: string, countdown: string;
  if (!isAfterSunrise) { nextEvent = "Sunrise"; countdown = formatCountdown(riseDate.getTime() - now.getTime()); }
  else if (!isAfterSunset) { nextEvent = "Sunset"; countdown = formatCountdown(setDate.getTime() - now.getTime()); }
  else { nextEvent = "Sunrise"; const tr = new Date(riseDate); tr.setDate(tr.getDate() + 1); countdown = formatCountdown(tr.getTime() - now.getTime()); }

  const formatTime12h = (h: number, m: number): string => {
    const period = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${h12}:${m.toString().padStart(2, "0")} ${period}`;
  };

  const totalDayMs = setDate.getTime() - riseDate.getTime();
  const elapsed = now.getTime() - riseDate.getTime();
  const dayProgress = Math.max(0, Math.min(1, elapsed / totalDayMs));
  const isDaytime = isAfterSunrise && !isAfterSunset;

  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 8, height: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div className="metric-label" style={{ marginBottom: 3 }}>Sunrise</div>
          <div style={{ fontSize: 18, fontWeight: 300, color: "var(--color-accent-orange)", fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums", textShadow: "0 0 10px rgba(255, 179, 0, 0.4)" }}>
            {formatTime12h(riseH, riseM)}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="metric-label" style={{ marginBottom: 3 }}>Sunset</div>
          <div style={{ fontSize: 18, fontWeight: 300, color: "var(--color-accent-purple)", fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums", textShadow: "0 0 10px rgba(179, 136, 255, 0.4)" }}>
            {formatTime12h(setH, setM)}
          </div>
        </div>
      </div>
      <div style={{ position: "relative", height: 28, marginTop: 2 }}>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 24, borderRadius: "50% 50% 0 0", border: "1px solid rgba(76, 159, 255, 0.1)", borderBottom: "1px solid rgba(76, 159, 255, 0.06)" }} />
        {isDaytime && (
          <div style={{ position: "absolute", bottom: Math.sin(dayProgress * Math.PI) * 22, left: `${dayProgress * 100}%`, width: 8, height: 8, borderRadius: "50%", background: "var(--color-accent-orange)", boxShadow: "0 0 12px var(--color-accent-orange), 0 0 24px rgba(255, 179, 0, 0.4)", transform: "translateX(-4px)" }} />
        )}
      </div>
      <div style={{ textAlign: "center" }}>
        <span className="metric-label">{nextEvent} in </span>
        <span style={{ fontSize: 15, fontWeight: 400, color: "var(--color-accent-cyan)", fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums", textShadow: "0 0 8px rgba(24, 255, 255, 0.4)" }}>{countdown}</span>
      </div>
      <div className="glass-divider" />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 11, color: "var(--color-t-secondary)", fontWeight: 400, fontFamily: "var(--font-sans)" }}>{moonPhase || "Moon"}</span>
        <span style={{ fontSize: 11, color: "var(--color-accent-purple)", fontWeight: 500, fontFamily: "var(--font-mono)" }}>
          {moonIllumination !== undefined ? `${Math.round(moonIllumination * 100)}%` : ""}
        </span>
      </div>
    </div>
  );
}

registerWidget("sun", { title: "Sun & Moon", topic: "sun", component: SunWidget, defaultSize: { width: 3, height: 2 } });
