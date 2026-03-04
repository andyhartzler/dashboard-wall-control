"use client";

import { registerWidget } from "./registry";

interface CalEvent { title: string; start: string; end: string; calendar: string; all_day: boolean; }

const CALENDAR_COLORS: Record<string, string> = {
  default: "var(--color-accent-blue)", home: "var(--color-accent-green)", work: "var(--color-accent-purple)",
  family: "var(--color-accent-orange)", personal: "var(--color-accent-cyan)",
};

function CalendarWidget({ data }: { data: Record<string, unknown> }) {
  const events = (data.events as CalEvent[]) || [];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0, height: "100%", overflowY: "auto" }}>
      {events.length === 0 && <div className="metric-label" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>Connect Home Assistant for calendar data</div>}
      {events.map((ev, i) => {
        const start = new Date(ev.start);
        const timeStr = ev.all_day ? "ALL DAY" : start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
        const calColor = CALENDAR_COLORS[ev.calendar?.toLowerCase()] || CALENDAR_COLORS.default;
        return (
          <div key={i} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: "1px solid rgba(80, 120, 200, 0.06)" }}>
            <div className="accent-bar" style={{ background: calColor, boxShadow: `0 0 4px ${calColor}` }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: "var(--color-t-primary)", fontFamily: "var(--font-sans)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{ev.title}</div>
              <div style={{ fontSize: 10, fontWeight: 600, color: ev.all_day ? calColor : "var(--color-t-muted)", marginTop: 3, letterSpacing: "0.04em", fontFamily: "var(--font-mono)" }}>{timeStr}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

registerWidget("calendar", { title: "Calendar", topic: "calendar", component: CalendarWidget, defaultSize: { width: 3, height: 4 } });
