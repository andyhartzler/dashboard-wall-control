"use client";

import { registerWidget } from "./registry";

interface CalEvent {
  title: string;
  start: string;
  end: string;
  calendar: string;
  all_day: boolean;
  location?: string;
}

const CALENDAR_COLORS: Record<string, string> = {
  default: "#4C9FFF",
  home: "#00E676",
  work: "#B388FF",
  family: "#FFB300",
  personal: "#18FFFF",
  holidays: "#FF4081",
  birthdays: "#FF5252",
};

function getCalColor(cal: string): string {
  return CALENDAR_COLORS[cal?.toLowerCase()] || CALENDAR_COLORS.default;
}

function CalendarWidget({ data }: { data: Record<string, unknown> }) {
  const events = (data.events as CalEvent[]) || [];
  const now = new Date();
  const dayNumber = now.getDate();
  const weekday = now.toLocaleDateString("en-US", { weekday: "long" });
  const month = now.toLocaleDateString("en-US", { month: "long" });

  const allDayEvents = events.filter(e => e.all_day);
  const timedEvents = events.filter(e => !e.all_day).sort((a, b) =>
    new Date(a.start).getTime() - new Date(b.start).getTime()
  );

  return (
    <div style={{
      display: "flex", flexDirection: "column", height: "100%", gap: 0,
    }}>
      <div style={{ paddingBottom: 8, borderBottom: "1px solid rgba(80, 120, 200, 0.08)" }}>
        <div style={{
          fontSize: 11, fontWeight: 600, color: "var(--color-accent-red)",
          textTransform: "uppercase", letterSpacing: "0.06em",
          fontFamily: "var(--font-sans)",
        }}>
          {weekday}
        </div>
        <div style={{
          display: "flex", alignItems: "baseline", gap: 6,
        }}>
          <span style={{
            fontSize: 34, fontWeight: 700, color: "var(--color-t-primary)",
            lineHeight: 1, fontFamily: "var(--font-sans)",
          }}>
            {dayNumber}
          </span>
          <span style={{
            fontSize: 15, fontWeight: 400, color: "var(--color-t-secondary)",
            fontFamily: "var(--font-sans)",
          }}>
            {month}
          </span>
        </div>
      </div>

      {allDayEvents.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, padding: "6px 0" }}>
          {allDayEvents.map((ev, i) => {
            const color = getCalColor(ev.calendar);
            return (
              <div key={i} style={{
                background: color + "20", borderRadius: 6, padding: "3px 8px",
                fontSize: 11, fontWeight: 500, color: color,
                fontFamily: "var(--font-sans)",
              }}>
                {ev.title}
              </div>
            );
          })}
        </div>
      )}

      <div style={{ flex: 1, overflowY: "auto", paddingTop: 6 }}>
        {events.length === 0 && (
          <div className="metric-label" style={{
            display: "flex", alignItems: "center", justifyContent: "center", height: "100%",
          }}>
            Connect Home Assistant for calendar data
          </div>
        )}
        {timedEvents.map((ev, i) => {
          const start = new Date(ev.start);
          const end = new Date(ev.end);
          const timeStr = start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
          const endStr = end.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
          const color = getCalColor(ev.calendar);
          const isPast = end.getTime() < now.getTime();
          const isCurrent = start.getTime() <= now.getTime() && end.getTime() > now.getTime();

          return (
            <div key={i} style={{
              display: "flex", gap: 10, padding: "6px 0",
              opacity: isPast ? 0.4 : 1,
            }}>
              <div style={{
                width: 50, flexShrink: 0, textAlign: "right", paddingTop: 2,
              }}>
                <div style={{
                  fontSize: 11, fontWeight: 600, color: "var(--color-t-muted)",
                  fontFamily: "var(--font-mono)",
                }}>
                  {timeStr}
                </div>
              </div>
              <div style={{
                flex: 1, borderLeft: `3px solid ${color}`,
                background: isCurrent ? color + "10" : "transparent",
                borderRadius: "0 8px 8px 0", padding: "6px 10px",
                minWidth: 0,
              }}>
                <div style={{
                  fontSize: 13, fontWeight: 500, color: "var(--color-t-primary)",
                  fontFamily: "var(--font-sans)",
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>
                  {ev.title}
                </div>
                <div style={{
                  fontSize: 10, color: "var(--color-t-muted)", marginTop: 2,
                  fontFamily: "var(--font-mono)",
                }}>
                  {timeStr} - {endStr}
                  {ev.location && <span> &middot; {ev.location}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

registerWidget("calendar", {
  title: "Calendar",
  topic: "calendar",
  component: CalendarWidget,
  defaultSize: { width: 3, height: 4 },
});
