"use client";

import { registerWidget } from "./registry";

interface Article { title: string; source: string; published: string; link: string; }

function _timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function NewsWidgetInner({ data, accentColor }: { data: Record<string, unknown>; accentColor: string }) {
  const articles = (data.articles as Article[]) || [];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0, height: "100%", overflowY: "auto" }}>
      {articles.length === 0 && <div className="metric-label" style={{ padding: 8 }}>Awaiting headlines...</div>}
      {articles.slice(0, 12).map((article, i) => (
        <div key={i} style={{ padding: "8px 0", borderBottom: "1px solid rgba(80, 120, 200, 0.06)" }}>
          <div style={{
            fontSize: 13, fontWeight: 500, lineHeight: 1.4, color: "var(--color-t-primary)",
            fontFamily: "var(--font-sans)", display: "-webkit-box",
            WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
          }}>{article.title}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4, fontSize: 10, fontWeight: 600, letterSpacing: "0.03em" }}>
            <span style={{ color: accentColor }}>{article.source}</span>
            {article.published && (
              <>
                <span style={{ color: "var(--color-t-muted)", opacity: 0.4 }}>&bull;</span>
                <span style={{ color: "var(--color-t-muted)" }}>{_timeAgo(article.published)}</span>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function KCNewsWidget({ data }: { data: Record<string, unknown> }) {
  return <NewsWidgetInner data={data} accentColor="var(--color-accent-orange)" />;
}

function WorldNewsWidget({ data }: { data: Record<string, unknown> }) {
  return <NewsWidgetInner data={data} accentColor="var(--color-accent-red)" />;
}

registerWidget("news_kc", { title: "KC News", topic: "news_kc", component: KCNewsWidget, defaultSize: { width: 3, height: 4 } });
registerWidget("news_world", { title: "World News", topic: "news_world", component: WorldNewsWidget, defaultSize: { width: 3, height: 4 } });
