"use client";

import { useEffect, useRef } from "react";
import { registerWidget } from "./registry";

// Animated star field
function useStarField(canvasRef: React.RefObject<HTMLCanvasElement | null>, starCount = 60) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const stars: { x: number; y: number; r: number; phase: number; speed: number }[] = [];
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random(),
        y: Math.random(),
        r: Math.random() * 1.2 + 0.3,
        phase: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 1.2,
      });
    }

    let frame: number;
    const draw = (t: number) => {
      const w = canvas.width = canvas.offsetWidth * 2;
      const h = canvas.height = canvas.offsetHeight * 2;
      ctx.clearRect(0, 0, w, h);

      for (const s of stars) {
        const alpha = 0.3 + 0.7 * ((Math.sin(t * 0.001 * s.speed + s.phase) + 1) / 2);
        ctx.beginPath();
        ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 210, 255, ${alpha})`;
        ctx.fill();
      }
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [canvasRef, starCount]);
}

function MoonPhaseWidget({ data, width, height }: { data: Record<string, unknown>; width?: number; height?: number }) {
  const moonPhase = data.moon_phase as string | undefined;
  const moonIllumination = data.moon_illumination as number | undefined;
  const phaseValue = data.moon_phase_value as number | undefined;
  const moonrise = data.moonrise as string | undefined;
  const moonset = data.moonset as string | undefined;
  const daysUntilFull = data.days_until_full as number | undefined;
  const daysUntilNew = data.days_until_new as number | undefined;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const moonCanvasRef = useRef<HTMLCanvasElement>(null);

  useStarField(canvasRef);

  const illuminationPct = moonIllumination !== undefined ? Math.round(moonIllumination * 100) : 0;
  const phase = phaseValue ?? 0;

  const isCompact = (width ?? 2) <= 2 && (height ?? 3) <= 2;
  const moonSize = isCompact ? 52 : 68;

  // Draw moon on canvas for realistic rendering
  useEffect(() => {
    const canvas = moonCanvasRef.current;
    if (!canvas) return;
    const size = moonSize * 2;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cx = size / 2;
    const cy = size / 2;
    const r = size / 2 - 2;

    // Moon base (lit surface)
    const grad = ctx.createRadialGradient(cx * 0.8, cy * 0.75, r * 0.1, cx, cy, r);
    grad.addColorStop(0, "#f0edd4");
    grad.addColorStop(0.4, "#d8d4b0");
    grad.addColorStop(0.7, "#bab592");
    grad.addColorStop(1, "#8a8568");
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    // Subtle mare (dark patches)
    const mares = [
      { x: 0.35, y: 0.3, r: 0.18, a: 0.08 },
      { x: 0.55, y: 0.45, r: 0.22, a: 0.06 },
      { x: 0.4, y: 0.65, r: 0.15, a: 0.07 },
      { x: 0.65, y: 0.25, r: 0.1, a: 0.05 },
      { x: 0.3, y: 0.5, r: 0.12, a: 0.06 },
    ];
    for (const m of mares) {
      const mg = ctx.createRadialGradient(
        cx + (m.x - 0.5) * size, cy + (m.y - 0.5) * size, 0,
        cx + (m.x - 0.5) * size, cy + (m.y - 0.5) * size, m.r * size
      );
      mg.addColorStop(0, `rgba(60, 55, 40, ${m.a})`);
      mg.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.arc(cx + (m.x - 0.5) * size, cy + (m.y - 0.5) * size, m.r * size, 0, Math.PI * 2);
      ctx.fillStyle = mg;
      ctx.fill();
    }

    // Craters
    const craters = [
      { x: 0.28, y: 0.22, r: 0.04 },
      { x: 0.62, y: 0.38, r: 0.035 },
      { x: 0.45, y: 0.7, r: 0.03 },
      { x: 0.72, y: 0.55, r: 0.025 },
      { x: 0.35, y: 0.48, r: 0.02 },
      { x: 0.55, y: 0.2, r: 0.02 },
    ];
    for (const c of craters) {
      ctx.beginPath();
      ctx.arc(cx + (c.x - 0.5) * size, cy + (c.y - 0.5) * size, c.r * size, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(0,0,0,0.06)";
      ctx.lineWidth = 1;
      ctx.stroke();
      const cg = ctx.createRadialGradient(
        cx + (c.x - 0.5) * size, cy + (c.y - 0.5) * size, 0,
        cx + (c.x - 0.5) * size, cy + (c.y - 0.5) * size, c.r * size
      );
      cg.addColorStop(0, "rgba(0,0,0,0.04)");
      cg.addColorStop(0.7, "rgba(0,0,0,0.02)");
      cg.addColorStop(1, "transparent");
      ctx.fillStyle = cg;
      ctx.fill();
    }

    // Terminator shadow
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();

    const isWaxing = phase < 0.5;
    const normPhase = isWaxing ? phase * 2 : (phase - 0.5) * 2;

    ctx.globalCompositeOperation = "source-atop";

    if (phase < 0.01 || phase > 0.99) {
      ctx.fillStyle = "rgba(5, 8, 18, 0.95)";
      ctx.fillRect(0, 0, size, size);
    } else if (phase > 0.49 && phase < 0.51) {
      // Full moon: no shadow
    } else {
      const terminatorX = isWaxing
        ? cx - Math.cos(normPhase * Math.PI) * r
        : cx + Math.cos(normPhase * Math.PI) * r;

      ctx.beginPath();
      if (isWaxing) {
        ctx.moveTo(cx, cy - r);
        ctx.arc(cx, cy, r, -Math.PI / 2, Math.PI / 2, false);
        for (let i = 0; i <= 50; i++) {
          const t = (i / 50) * Math.PI - Math.PI / 2;
          const tx = terminatorX + (cx - terminatorX) * Math.cos(t) * 0 + (terminatorX - cx) * 0;
          const ty = cy + r * Math.sin(t);
          const ex = cx + (terminatorX - cx) * Math.cos(t - Math.PI / 2);
          const angle = (i / 50) * Math.PI;
          const px = terminatorX + 0 * Math.cos(angle);
          const py = cy - r + (2 * r * i) / 50;
          void tx; void ty; void ex; void px; void py;
        }
        ctx.closePath();
        ctx.restore();
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.clip();
        ctx.globalCompositeOperation = "source-atop";

        const shadowGrad = ctx.createLinearGradient(
          isWaxing ? 0 : size, 0,
          isWaxing ? terminatorX : terminatorX, 0
        );
        shadowGrad.addColorStop(0, "rgba(5, 8, 18, 0.95)");
        shadowGrad.addColorStop(0.85, "rgba(5, 8, 18, 0.92)");
        shadowGrad.addColorStop(1, "rgba(5, 8, 18, 0.3)");
        ctx.fillStyle = shadowGrad;
        if (isWaxing) {
          ctx.fillRect(0, 0, terminatorX + 4, size);
        } else {
          ctx.fillRect(terminatorX - 4, 0, size - terminatorX + 4, size);
        }
      } else {
        const shadowGrad = ctx.createLinearGradient(
          terminatorX, 0, size, 0
        );
        shadowGrad.addColorStop(0, "rgba(5, 8, 18, 0.3)");
        shadowGrad.addColorStop(0.15, "rgba(5, 8, 18, 0.92)");
        shadowGrad.addColorStop(1, "rgba(5, 8, 18, 0.95)");
        ctx.fillStyle = shadowGrad;
        ctx.fillRect(terminatorX - 4, 0, size - terminatorX + 4, size);
      }
    }

    ctx.restore();

    // Rim light on the lit edge
    ctx.beginPath();
    ctx.arc(cx, cy, r - 0.5, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(240, 237, 212, ${0.1 + (illuminationPct / 100) * 0.15})`;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }, [phase, moonSize, illuminationPct]);

  if (!moonPhase) {
    return <div className="metric-label" style={{ padding: 8 }}>Awaiting moon data...</div>;
  }

  const glowIntensity = illuminationPct / 100;
  const nextEvent = (daysUntilNew ?? 99) < (daysUntilFull ?? 99)
    ? { label: "New Moon", days: daysUntilNew ?? 0 }
    : { label: "Full Moon", days: daysUntilFull ?? 0 };

  return (
    <div style={{
      position: "relative", height: "100%", overflow: "hidden",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      gap: isCompact ? 6 : 10,
    }}>
      {/* Star field */}
      <canvas ref={canvasRef} style={{
        position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none",
      }} />

      {/* Moon with glow */}
      <div style={{
        position: "relative", zIndex: 1,
        width: moonSize, height: moonSize,
        animation: "moon-float 8s ease-in-out infinite",
      }}>
        {/* Outer glow */}
        <div style={{
          position: "absolute",
          inset: -moonSize * 0.3,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(232, 230, 200, ${0.06 * glowIntensity}) 0%, transparent 70%)`,
          animation: "moon-glow 4s ease-in-out infinite",
        }} />
        {/* Moon canvas */}
        <canvas ref={moonCanvasRef} style={{
          width: moonSize, height: moonSize, borderRadius: "50%",
          filter: `drop-shadow(0 0 ${6 + glowIntensity * 12}px rgba(232, 230, 200, ${0.15 + glowIntensity * 0.2}))`,
        }} />
      </div>

      {/* Phase name */}
      <div style={{
        position: "relative", zIndex: 1, textAlign: "center",
      }}>
        <div style={{
          fontSize: isCompact ? 12 : 14, fontWeight: 600, color: "var(--color-t-primary)",
          fontFamily: "var(--font-sans)", letterSpacing: "0.02em",
        }}>
          {moonPhase}
        </div>
        <div style={{
          fontSize: isCompact ? 10 : 12, fontWeight: 500, marginTop: 2,
          color: "rgba(200, 190, 140, 0.9)",
          fontFamily: "var(--font-mono)",
        }}>
          {illuminationPct}%
        </div>
      </div>

      {/* Rise/Set + Next event */}
      <div style={{
        position: "relative", zIndex: 1,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
      }}>
        {(moonrise || moonset) && (
          <div style={{
            display: "flex", gap: 12, fontSize: 9, color: "var(--color-t-muted)",
            fontFamily: "var(--font-mono)", letterSpacing: "0.03em",
          }}>
            {moonrise && <span>&#x25B2; {moonrise}</span>}
            {moonset && <span>&#x25BC; {moonset}</span>}
          </div>
        )}
        {nextEvent.days > 0 && (
          <div style={{
            fontSize: 9, color: "var(--color-t-muted)",
            fontFamily: "var(--font-mono)", letterSpacing: "0.04em",
          }}>
            {nextEvent.label} in {nextEvent.days}d
          </div>
        )}
      </div>

      <style>{`
        @keyframes moon-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes moon-glow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}

registerWidget("moon", {
  title: "Moon Phase",
  topic: "sun",
  component: MoonPhaseWidget,
  defaultSize: { width: 2, height: 3 },
});
