"use client";

import { useMemo } from "react";
import { registerWidget } from "./registry";

interface Article { title: string; source: string; }

const STOP_WORDS = new Set([
  "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "by", "from", "as",
  "is", "was", "are", "were", "be", "been", "has", "have", "had", "do", "does", "did", "will", "would",
  "could", "should", "may", "might", "can", "shall", "it", "its", "that", "this", "these", "those",
  "he", "she", "they", "we", "you", "not", "no", "nor", "so", "up", "out", "if", "about", "who", "what",
  "where", "when", "how", "all", "each", "every", "both", "few", "more", "most", "other", "some", "such",
  "only", "own", "same", "than", "too", "very", "just", "because", "into", "over", "after", "before", "new",
  "says", "said", "also", "us", "his", "her", "my", "your", "our", "their", "i", "me", "him", "them",
  "any", "many", "much", "get", "now", "news", "report", "reports", "say", "one", "two", "first",
]);

const BAR_COLORS = [
  "var(--color-accent-pink)", "var(--color-accent-cyan)", "var(--color-accent-orange)",
  "var(--color-accent-green)", "var(--color-accent-purple)", "var(--color-accent-blue)", "var(--color-accent-red)",
];

function TrendingWidget({ data }: { data: Record<string, unknown> }) {
  const articles = (data.articles as Article[]) || [];
  const trending = useMemo(() => {
    const wordCounts: Record<string, number> = {};
    for (const article of articles) {
      const words = article.title.toLowerCase().replace(/[^a-z\s'-]/g, "").split(/\s+/).filter((w) => w.length > 2 && !STOP_WORDS.has(w));
      const seen = new Set<string>();
      for (const word of words) { if (!seen.has(word)) { wordCounts[word] = (wordCounts[word] || 0) + 1; seen.add(word); } }
    }
    return Object.entries(wordCounts).filter(([, count]) => count >= 2).sort((a, b) => b[1] - a[1]).slice(0, 10);
  }, [articles]);

  if (articles.length === 0) return <div className="metric-label" style={{ padding: 8 }}>Awaiting trend data...</div>;
  if (trending.length === 0) return <div className="metric-label" style={{ padding: 8 }}>Not enough data for trends</div>;

  const maxCount = trending[0][1];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3, height: "100%", overflowY: "auto" }}>
      {trending.map(([word, count], i) => {
        const barWidth = Math.round((count / maxCount) * 100);
        const color = BAR_COLORS[i % BAR_COLORS.length];
        return (
          <div key={word} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: "var(--color-t-muted)", minWidth: 14, textAlign: "right", fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums" }}>{i + 1}</span>
            <div style={{ flex: 1, position: "relative" }}>
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${barWidth}%`, background: `linear-gradient(90deg, ${color}20, transparent)`, borderRadius: 4 }} />
              <div style={{ position: "relative", padding: "3px 6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, fontWeight: 500, textTransform: "capitalize", color, fontFamily: "var(--font-sans)" }}>{word}</span>
                <span style={{ fontSize: 10, color: "var(--color-t-muted)", fontVariantNumeric: "tabular-nums", fontWeight: 600, fontFamily: "var(--font-mono)" }}>{count}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

registerWidget("trending", { title: "Trending", topic: "news_world", component: TrendingWidget, defaultSize: { width: 3, height: 2 } });
