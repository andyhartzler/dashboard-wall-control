"use client";

import { registerWidget } from "./registry";

interface Reminder {
  title: string;
  due: string | null;
  completed: boolean;
  list: string;
  priority?: number;
}

const LIST_COLORS: Record<string, string> = {
  default: "#4C9FFF",
  reminders: "#4C9FFF",
  groceries: "#00E676",
  work: "#B388FF",
  personal: "#18FFFF",
  shopping: "#FFB300",
  home: "#FF4081",
};

function getListColor(list: string): string {
  return LIST_COLORS[list?.toLowerCase()] || LIST_COLORS.default;
}

function getDuePill(due: string | null): { text: string; color: string } | null {
  if (!due) return null;
  const dueDate = new Date(due);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dueDay = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
  const diffDays = Math.round((dueDay.getTime() - today.getTime()) / 86400000);

  if (diffDays < 0) return { text: "Overdue", color: "#FF5252" };
  if (diffDays === 0) return { text: "Today", color: "#4C9FFF" };
  if (diffDays === 1) return { text: "Tomorrow", color: "#FFB300" };
  return { text: dueDate.toLocaleDateString("en-US", { month: "short", day: "numeric" }), color: "var(--color-t-muted)" };
}

function priorityIndicator(priority?: number): string {
  if (priority === 1) return "!!!";
  if (priority === 2) return "!!";
  if (priority === 3) return "!";
  return "";
}

function RemindersWidget({ data }: { data: Record<string, unknown> }) {
  const reminders = (data.reminders as Reminder[]) || [];

  if (reminders.length === 0) {
    return (
      <div className="metric-label" style={{
        display: "flex", alignItems: "center", justifyContent: "center", height: "100%",
      }}>
        Connect Home Assistant for reminders
      </div>
    );
  }

  const grouped: Record<string, Reminder[]> = {};
  for (const r of reminders) {
    const list = r.list || "Reminders";
    if (!grouped[list]) grouped[list] = [];
    grouped[list].push(r);
  }

  const listNames = Object.keys(grouped);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0, height: "100%", overflowY: "auto" }}>
      {listNames.map((listName, li) => {
        const items = grouped[listName];
        const color = getListColor(listName);
        const incomplete = items.filter(r => !r.completed);
        const complete = items.filter(r => r.completed);
        const sortedItems = [...incomplete, ...complete];

        return (
          <div key={listName} style={{ marginBottom: li < listNames.length - 1 ? 10 : 0 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8, paddingBottom: 6,
              borderBottom: "1px solid rgba(80, 120, 200, 0.06)",
            }}>
              <div style={{
                width: 12, height: 12, borderRadius: "50%", background: color,
                boxShadow: `0 0 6px ${color}60`,
              }} />
              <span style={{
                fontSize: 14, fontWeight: 600, color: color,
                fontFamily: "var(--font-sans)",
              }}>
                {listName}
              </span>
              <span style={{
                fontSize: 11, color: "var(--color-t-muted)",
                fontFamily: "var(--font-mono)",
              }}>
                {incomplete.length}
              </span>
            </div>

            {sortedItems.map((r, i) => {
              const duePill = getDuePill(r.due);
              const prio = priorityIndicator(r.priority);

              return (
                <div key={i} style={{
                  display: "flex", alignItems: "flex-start", gap: 10, padding: "7px 0 7px 4px",
                  borderBottom: i < sortedItems.length - 1 ? "1px solid rgba(80, 120, 200, 0.04)" : "none",
                }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: 10, flexShrink: 0, marginTop: 1,
                    border: `2px solid ${r.completed ? color : "rgba(80, 120, 200, 0.25)"}`,
                    background: r.completed ? color : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    boxShadow: r.completed ? `0 0 8px ${color}40` : "none",
                  }}>
                    {r.completed && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      display: "flex", alignItems: "center", gap: 4,
                    }}>
                      {prio && (
                        <span style={{
                          fontSize: 12, fontWeight: 700, color: "#FF5252",
                          fontFamily: "var(--font-mono)",
                        }}>
                          {prio}
                        </span>
                      )}
                      <span style={{
                        fontSize: 13, fontWeight: r.completed ? 400 : 500,
                        fontFamily: "var(--font-sans)",
                        color: r.completed ? "var(--color-t-muted)" : "var(--color-t-primary)",
                        textDecoration: r.completed ? "line-through" : "none",
                        opacity: r.completed ? 0.5 : 1,
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                      }}>
                        {r.title}
                      </span>
                    </div>
                    {duePill && !r.completed && (
                      <span style={{
                        fontSize: 10, fontWeight: 600, color: duePill.color,
                        fontFamily: "var(--font-mono)",
                        marginTop: 2, display: "inline-block",
                        background: duePill.color + "15", borderRadius: 4, padding: "1px 5px",
                      }}>
                        {duePill.text}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

registerWidget("reminders", {
  title: "Reminders",
  topic: "reminders",
  component: RemindersWidget,
  defaultSize: { width: 3, height: 2 },
});
