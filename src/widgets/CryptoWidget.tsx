"use client";

import { registerWidget } from "./registry";

interface Coin { id: string; name: string; price: number; change_24h: number; market_cap: number; }

const COIN_SYMBOLS: Record<string, string> = { bitcoin: "BTC", ethereum: "ETH", solana: "SOL", dogecoin: "DOGE", cardano: "ADA" };
const COIN_COLORS: Record<string, string> = { bitcoin: "#F7931A", ethereum: "#627EEA", solana: "#00FFA3", dogecoin: "#C3A634", cardano: "var(--color-accent-blue)" };

function CryptoWidget({ data }: { data: Record<string, unknown> }) {
  const coins = (data.coins as Coin[]) || [];
  if (coins.length === 0) return <div className="metric-label" style={{ padding: 8 }}>Awaiting crypto data...</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 6, height: "100%" }}>
      {coins.map((coin) => {
        const isUp = coin.change_24h >= 0;
        const color = isUp ? "var(--color-accent-green)" : "var(--color-accent-red)";
        const bgColor = isUp ? "rgba(0, 230, 118, 0.12)" : "rgba(255, 82, 82, 0.12)";
        const glow = isUp ? "rgba(0, 230, 118, 0.4)" : "rgba(255, 82, 82, 0.4)";
        const arrow = isUp ? "\u25B2" : "\u25BC";
        const symbol = COIN_SYMBOLS[coin.id] || coin.id.toUpperCase();
        const coinColor = COIN_COLORS[coin.id] || "var(--color-accent-orange)";
        const formattedPrice = coin.price >= 1
          ? coin.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
          : coin.price.toFixed(4);
        return (
          <div key={coin.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: coinColor, letterSpacing: "0.04em", fontFamily: "var(--font-mono)", textShadow: `0 0 8px ${coinColor}40`, minWidth: 32 }}>{symbol}</span>
              <span style={{ fontSize: 12, color: "var(--color-t-secondary)", fontWeight: 400, fontFamily: "var(--font-sans)" }}>{coin.name}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ fontSize: 14, fontWeight: 400, fontVariantNumeric: "tabular-nums", fontFamily: "var(--font-mono)", letterSpacing: "-0.02em", color: "var(--color-t-primary)" }}>${formattedPrice}</div>
              <div style={{ fontSize: 10, fontWeight: 600, color, background: bgColor, padding: "3px 7px", borderRadius: 6, fontVariantNumeric: "tabular-nums", fontFamily: "var(--font-mono)", textShadow: `0 0 8px ${glow}` }}>
                {arrow} {Math.abs(coin.change_24h).toFixed(2)}%
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

registerWidget("crypto", { title: "Crypto", topic: "crypto", component: CryptoWidget, defaultSize: { width: 3, height: 2 } });
