"use client";

import { registerWidget } from "./registry";

interface Reminder { title: string; due: string | null; completed: boolean; list: string; }

function RemindersWidget({ data }: { data: Record<string, unknown> }) {
  const reminders = (data.reminders as Reminder[]) || [];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2, height: "100%", overflowY: "auto" }}>
      {reminders.length === 0 && <div className="metric-label" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>Connect Home Assistant for reminders</div>}
      {reminders.map((r, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "5px 0" }}>
          <div style={{
            width: 16, height: 16, borderRadius: 8,
            border: `1.5px solid ${r.completed ? "var(--color-accent-pink)" : "rgba(80, 120, 200, 0.2)"}`,
            background: r.completed ? "var(--color-accent-pink)" : "transparent", flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.3s ease", boxShadow: r.completed ? "0 0 6px rgba(255, 64, 129, 0.4)" : "none",
          }}>
            {r.completed && (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 5L4.5 7.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          <div style={{
            fontSize: 13, fontWeight: 400, fontFamily: "var(--font-sans)",
            color: r.completed ? "var(--color-t-muted)" : "var(--color-t-primary)",
            opacity: r.completed ? 0.5 : 1, textDecoration: r.completed ? "line-through" : "none",
          }}>{r.title}</div>
        </div>
      ))}
    </div>
  );
}

registerWidget("reminders", { title: "Reminders", topic: "reminders", component: RemindersWidget, defaultSize: { width: 3, height: 2 } });
