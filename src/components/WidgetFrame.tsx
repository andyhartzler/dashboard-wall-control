"use client";

import type { ReactNode } from "react";

interface WidgetFrameProps {
  title: string;
  children: ReactNode;
  col: number;
  row: number;
  width: number;
  height: number;
}

const TITLE_COLORS: Record<string, string> = {
  Clock: "var(--color-accent-cyan)",
  Weather: "var(--color-accent-blue)",
  Calendar: "var(--color-accent-purple)",
  Reminders: "var(--color-accent-pink)",
  "Air Traffic": "var(--color-accent-green)",
  "KC News": "var(--color-accent-orange)",
  "World News": "var(--color-accent-red)",
  Markets: "var(--color-accent-green)",
  Crypto: "var(--color-accent-orange)",
  Webcams: "var(--color-accent-cyan)",
  "Sun & Moon": "var(--color-accent-orange)",
  "Moon Phase": "var(--color-accent-purple)",
  Earthquakes: "var(--color-accent-red)",
  "World Seismic Map": "var(--color-accent-red)",
  "Weather Radar": "var(--color-accent-cyan)",
  "KC Sports": "var(--color-accent-blue)",
  System: "var(--color-accent-cyan)",
  Predictions: "var(--color-accent-purple)",
  Conflicts: "var(--color-accent-red)",
  "FAA Status": "var(--color-accent-orange)",
  "Smart Home": "var(--color-accent-green)",
  Trending: "var(--color-accent-pink)",
};

export function WidgetFrame({ title, children, col, row, width, height }: WidgetFrameProps) {
  const titleColor = TITLE_COLORS[title] || "var(--color-accent-blue)";

  return (
    <div
      className="glass-panel"
      style={{
        gridColumn: `${col} / span ${width}`,
        gridRow: `${row} / span ${height}`,
      }}
    >
      <div
        className="widget-title"
        style={{ color: titleColor, display: "flex", alignItems: "center", gap: 6 }}
      >
        <div
          style={{
            width: 4,
            height: 4,
            borderRadius: "50%",
            background: titleColor,
            boxShadow: `0 0 6px ${titleColor}`,
            flexShrink: 0,
          }}
        />
        {title}
      </div>
      <div className="widget-body">{children}</div>
    </div>
  );
}
