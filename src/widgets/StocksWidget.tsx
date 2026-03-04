"use client";

import { registerWidget } from "./registry";

interface Quote { symbol: string; name: string; price: number; change: number; change_pct: number; }

function StocksWidget({ data }: { data: Record<string, unknown> }) {
  const quotes = (data.quotes as Quote[]) || [];

  if (quotes.length === 0) {
    return <div className="metric-label" style={{ padding: 8 }}>Awaiting market data...</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 6, height: "100%" }}>
      {quotes.map((q) => {
        const isUp = q.change >= 0;
        const color = isUp ? "var(--color-accent-green)" : "var(--color-accent-red)";
        const bgColor = isUp ? "rgba(0, 230, 118, 0.12)" : "rgba(255, 82, 82, 0.12)";
        const glow = isUp ? "rgba(0, 230, 118, 0.4)" : "rgba(255, 82, 82, 0.4)";
        const arrow = isUp ? "\u25B2" : "\u25BC";
        return (
          <div key={q.symbol} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: "var(--color-accent-blue)", letterSpacing: "0.06em", fontFamily: "var(--font-mono)", minWidth: 32 }}>
                {q.symbol || q.name.slice(0, 4).toUpperCase()}
              </span>
              <span style={{ fontSize: 12, color: "var(--color-t-secondary)", fontWeight: 400, fontFamily: "var(--font-sans)" }}>{q.name}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ fontSize: 15, fontWeight: 400, fontVariantNumeric: "tabular-nums", fontFamily: "var(--font-mono)", letterSpacing: "-0.02em", color: "var(--color-t-primary)" }}>
                {q.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div style={{ fontSize: 10, fontWeight: 600, color, background: bgColor, padding: "3px 7px", borderRadius: 6, fontVariantNumeric: "tabular-nums", fontFamily: "var(--font-mono)", textShadow: `0 0 8px ${glow}` }}>
                {arrow} {Math.abs(q.change_pct).toFixed(2)}%
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

registerWidget("stocks", { title: "Markets", topic: "stocks", component: StocksWidget, defaultSize: { width: 3, height: 2 } });
