"use client";

import { registerWidget } from "./registry";

function PredictionWidget({ data }: { data: Record<string, unknown> }) {
  const markets = (data.markets as Array<{ title: string; outcomes: Array<{ label: string; probability: number }>; volume: number }>) || [];
  const predictions = markets.map((m) => ({
    question: m.title,
    probability: m.outcomes?.[0]?.probability ? m.outcomes[0].probability / 100 : 0,
    volume: m.volume ? `$${(m.volume / 1e6).toFixed(1)}M` : "",
  }));

  if (predictions.length === 0) return <div className="metric-label" style={{ padding: 8 }}>Awaiting prediction markets...</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0, height: "100%", overflowY: "auto" }}>
      {predictions.slice(0, 8).map((pred, i) => {
        const probPct = Math.round(pred.probability * 100);
        const color = probPct >= 70 ? "var(--color-accent-green)" : probPct >= 40 ? "var(--color-accent-orange)" : "var(--color-accent-red)";
        const bgColor = probPct >= 70 ? "rgba(0, 230, 118, 0.12)" : probPct >= 40 ? "rgba(255, 179, 0, 0.12)" : "rgba(255, 82, 82, 0.12)";
        const glow = probPct >= 70 ? "rgba(0, 230, 118, 0.4)" : probPct >= 40 ? "rgba(255, 179, 0, 0.4)" : "rgba(255, 82, 82, 0.4)";
        return (
          <div key={i} style={{ padding: "8px 0", borderBottom: "1px solid rgba(80, 120, 200, 0.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.4, flex: 1, color: "var(--color-t-primary)", fontFamily: "var(--font-sans)" }}>{pred.question}</div>
              <div style={{ fontSize: 15, fontWeight: 600, color, flexShrink: 0, fontVariantNumeric: "tabular-nums", fontFamily: "var(--font-mono)", background: bgColor, padding: "3px 8px", borderRadius: 6, textShadow: `0 0 8px ${glow}` }}>{probPct}%</div>
            </div>
            <div className="progress-bar" style={{ marginTop: 6 }}>
              <div className="progress-bar-fill" style={{ width: `${probPct}%`, background: color, boxShadow: `0 0 6px ${glow}` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

registerWidget("prediction", { title: "Predictions", topic: "prediction_markets", component: PredictionWidget, defaultSize: { width: 3, height: 4 } });
