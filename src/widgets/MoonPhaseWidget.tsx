"use client";

import { registerWidget } from "./registry";

function MoonPhaseWidget({ data }: { data: Record<string, unknown> }) {
  const moonPhase = data.moon_phase as string | undefined;
  const moonIllumination = data.moon_illumination as number | undefined;
  const phaseValue = data.moon_phase_value as number | undefined;
  const moonrise = data.moonrise as string | undefined;
  const moonset = data.moonset as string | undefined;
  const daysUntilFull = data.days_until_full as number | undefined;

  if (!moonPhase) {
    return <div className="metric-label" style={{ padding: 8 }}>Awaiting moon data...</div>;
  }

  const illuminationPct = moonIllumination !== undefined ? Math.round(moonIllumination * 100) : 0;
  const phase = phaseValue ?? 0;

  const isWaxing = phase < 0.5;
  const adjustedPhase = isWaxing ? phase : phase - 0.5;
  const terminatorScaleX = Math.cos(adjustedPhase * 2 * Math.PI);

  const moonSize = 90;
  const glowIntensity = illuminationPct / 100;
  const glowSpread = 20 + glowIntensity * 25;

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      gap: 10, height: "100%",
    }}>
      <div style={{
        position: "relative", width: moonSize, height: moonSize, borderRadius: "50%",
        boxShadow: `0 0 ${glowSpread}px rgba(232, 230, 200, ${0.08 + glowIntensity * 0.12}), 0 0 ${glowSpread * 2}px rgba(232, 230, 200, ${0.03 + glowIntensity * 0.05})`,
      }}>
        <div style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          background: "radial-gradient(circle at 40% 35%, #e8e6c8, #c4c098, #969270)",
        }} />
        <div style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          background: "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.08) 0%, transparent 20%), radial-gradient(circle at 60% 40%, rgba(0,0,0,0.06) 0%, transparent 15%), radial-gradient(circle at 45% 65%, rgba(0,0,0,0.05) 0%, transparent 12%), radial-gradient(circle at 70% 30%, rgba(0,0,0,0.04) 0%, transparent 10%)",
        }} />
        <div style={{
          position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute",
            top: 0, bottom: 0,
            width: "50%",
            ...(isWaxing ? { left: 0 } : { right: 0 }),
            background: "rgba(10, 14, 26, 0.92)",
          }} />
          <div style={{
            position: "absolute",
            top: 0, bottom: 0,
            left: "50%",
            width: "50%",
            transform: `translateX(-50%) scaleX(${terminatorScaleX})`,
            transformOrigin: "center",
            borderRadius: "50%",
            background: isWaxing
              ? (terminatorScaleX >= 0 ? "rgba(10, 14, 26, 0.92)" : "radial-gradient(circle at 40% 35%, #e8e6c8, #c4c098, #969270)")
              : (terminatorScaleX >= 0 ? "radial-gradient(circle at 40% 35%, #e8e6c8, #c4c098, #969270)" : "rgba(10, 14, 26, 0.92)"),
          }} />
        </div>
      </div>

      <div style={{
        fontSize: 15, fontWeight: 500, color: "var(--color-t-primary)",
        textAlign: "center", fontFamily: "var(--font-sans)",
      }}>
        {moonPhase}
      </div>

      <div style={{
        fontSize: 13, color: "var(--color-accent-purple)", fontWeight: 500,
        fontFamily: "var(--font-mono)",
        textShadow: "0 0 8px var(--color-accent-purple)",
      }}>
        {illuminationPct}% illuminated
      </div>

      {(moonrise || moonset) && (
        <div style={{
          display: "flex", gap: 16, fontSize: 11, color: "var(--color-t-muted)",
          fontFamily: "var(--font-mono)",
        }}>
          {moonrise && <span>Rise {moonrise}</span>}
          {moonset && <span>Set {moonset}</span>}
        </div>
      )}

      {daysUntilFull !== undefined && daysUntilFull > 0 && (
        <div style={{
          fontSize: 10, color: "var(--color-t-muted)", fontWeight: 500, letterSpacing: "0.04em",
        }}>
          Full moon in {daysUntilFull} day{daysUntilFull !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
}

registerWidget("moon", {
  title: "Moon Phase",
  topic: "sun",
  component: MoonPhaseWidget,
  defaultSize: { width: 3, height: 2 },
});
