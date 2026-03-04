"use client";

import { useEffect, useRef } from "react";
import { registerWidget } from "./registry";

function MoonPhaseWidget({ data }: { data: Record<string, unknown> }) {
  const moonPhase = data.moon_phase as string | undefined;
  const moonIllumination = data.moon_illumination as number | undefined;
  const phaseValue = data.moon_phase_value as number | undefined;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const illuminationPct = moonIllumination !== undefined ? Math.round(moonIllumination * 100) : 0;
  const phase = phaseValue ?? 0;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const size = 88;
    canvas.width = size * 2;
    canvas.height = size * 2;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const s = size * 2;
    const cx = s / 2;
    const cy = s / 2;
    const r = s / 2 - 4;

    const grad = ctx.createRadialGradient(cx * 0.85, cy * 0.8, r * 0.05, cx, cy, r);
    grad.addColorStop(0, "#e8e8e8");
    grad.addColorStop(0.3, "#d0d0d0");
    grad.addColorStop(0.6, "#b0b0b0");
    grad.addColorStop(1, "#808080");
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    const mares = [
      { x: 0.35, y: 0.3, r: 0.18, a: 0.12 },
      { x: 0.55, y: 0.45, r: 0.22, a: 0.10 },
      { x: 0.4, y: 0.65, r: 0.15, a: 0.11 },
      { x: 0.65, y: 0.25, r: 0.1, a: 0.08 },
      { x: 0.3, y: 0.5, r: 0.12, a: 0.09 },
    ];
    for (const m of mares) {
      const mg = ctx.createRadialGradient(
        cx + (m.x - 0.5) * s, cy + (m.y - 0.5) * s, 0,
        cx + (m.x - 0.5) * s, cy + (m.y - 0.5) * s, m.r * s
      );
      mg.addColorStop(0, `rgba(40, 40, 40, ${m.a})`);
      mg.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.arc(cx + (m.x - 0.5) * s, cy + (m.y - 0.5) * s, m.r * s, 0, Math.PI * 2);
      ctx.fillStyle = mg;
      ctx.fill();
    }

    const craters = [
      { x: 0.28, y: 0.22, r: 0.04 },
      { x: 0.62, y: 0.38, r: 0.035 },
      { x: 0.45, y: 0.7, r: 0.03 },
      { x: 0.72, y: 0.55, r: 0.025 },
    ];
    for (const c of craters) {
      const cg = ctx.createRadialGradient(
        cx + (c.x - 0.5) * s, cy + (c.y - 0.5) * s, 0,
        cx + (c.x - 0.5) * s, cy + (c.y - 0.5) * s, c.r * s
      );
      cg.addColorStop(0, "rgba(0,0,0,0.08)");
      cg.addColorStop(0.7, "rgba(0,0,0,0.03)");
      cg.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.arc(cx + (c.x - 0.5) * s, cy + (c.y - 0.5) * s, c.r * s, 0, Math.PI * 2);
      ctx.fillStyle = cg;
      ctx.fill();
    }

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();
    ctx.globalCompositeOperation = "source-atop";

    const isWaxing = phase < 0.5;
    const normPhase = isWaxing ? phase * 2 : (phase - 0.5) * 2;

    if (phase < 0.01 || phase > 0.99) {
      ctx.fillStyle = "rgba(5, 5, 10, 0.95)";
      ctx.fillRect(0, 0, s, s);
    } else if (!(phase > 0.49 && phase < 0.51)) {
      const terminatorX = isWaxing
        ? cx - Math.cos(normPhase * Math.PI) * r
        : cx + Math.cos(normPhase * Math.PI) * r;

      if (isWaxing) {
        const sg = ctx.createLinearGradient(0, 0, terminatorX, 0);
        sg.addColorStop(0, "rgba(5, 5, 10, 0.95)");
        sg.addColorStop(0.85, "rgba(5, 5, 10, 0.90)");
        sg.addColorStop(1, "rgba(5, 5, 10, 0.2)");
        ctx.fillStyle = sg;
        ctx.fillRect(0, 0, terminatorX + 4, s);
      } else {
        const sg = ctx.createLinearGradient(terminatorX, 0, s, 0);
        sg.addColorStop(0, "rgba(5, 5, 10, 0.2)");
        sg.addColorStop(0.15, "rgba(5, 5, 10, 0.90)");
        sg.addColorStop(1, "rgba(5, 5, 10, 0.95)");
        ctx.fillStyle = sg;
        ctx.fillRect(terminatorX - 4, 0, s - terminatorX + 4, s);
      }
    }

    ctx.restore();

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }, [phase, illuminationPct]);

  if (!moonPhase) {
    return <div style={{ padding: 8, opacity: 0.4, fontSize: 11 }}>...</div>;
  }

  return (
    <div style={{
      height: "100%",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      gap: 6,
    }}>
      <canvas ref={canvasRef} style={{
        width: 44, height: 44, borderRadius: "50%",
        filter: `drop-shadow(0 0 ${4 + (illuminationPct / 100) * 8}px rgba(200, 200, 220, ${0.1 + (illuminationPct / 100) * 0.15}))`,
      }} />
      <div style={{
        fontSize: 10, fontWeight: 500, color: "var(--color-t-primary)",
        fontFamily: "var(--font-sans)", letterSpacing: "0.02em",
        textAlign: "center",
      }}>
        {moonPhase}
      </div>
      <div style={{
        fontSize: 9, color: "var(--color-t-muted)",
        fontFamily: "var(--font-mono)",
      }}>
        {illuminationPct}%
      </div>
    </div>
  );
}

registerWidget("moon", {
  title: "Moon Phase",
  topic: "sun",
  component: MoonPhaseWidget,
  defaultSize: { width: 1, height: 2 },
});
