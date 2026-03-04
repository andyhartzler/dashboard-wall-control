"use client";

import { useState, useEffect, useCallback } from "react";
import { useDashboard } from "@/components/DashboardProvider";

interface WidgetConfig {
  id: string;
  enabled: boolean;
  [key: string]: unknown;
}

const LAYOUT_PRESETS = [
  { id: "default", label: "Default" },
  { id: "minimal", label: "Minimal" },
  { id: "news_focus", label: "News" },
  { id: "financial", label: "Finance" },
  { id: "weather_focus", label: "Weather" },
  { id: "world_monitor", label: "World" },
];

export default function ConfigPage() {
  const { url } = useDashboard();
  const [preset, setPreset] = useState("default");
  const [widgets, setWidgets] = useState<WidgetConfig[]>([]);
  const [status, setStatus] = useState("");

  const fetchConfig = useCallback(async () => {
    if (!url) return;
    try {
      const [configRes, widgetRes] = await Promise.all([
        fetch(`${url}/api/config`),
        fetch(`${url}/api/widgets`),
      ]);
      if (configRes.ok) {
        const data = await configRes.json();
        if (data.layout_preset) setPreset(data.layout_preset);
      }
      if (widgetRes.ok) {
        const data = await widgetRes.json();
        setWidgets(
          Array.isArray(data) ? data
            : Object.entries(data).map(([id, cfg]) => ({
                id, ...(typeof cfg === "object" && cfg !== null ? cfg : {}), enabled: true,
              } as WidgetConfig))
        );
      }
    } catch { /* */ }
  }, [url]);

  useEffect(() => { fetchConfig(); }, [fetchConfig]);

  const applyPreset = async (id: string) => {
    setPreset(id);
    if (!url) return;
    try {
      const res = await fetch(`${url}/api/layout/${id}`, { method: "PUT" });
      flash(res.ok ? "Layout applied" : "Failed");
    } catch { flash("Connection error"); }
  };

  const toggleWidget = async (widgetId: string, enabled: boolean) => {
    if (!url) return;
    setWidgets(prev => prev.map(w => w.id === widgetId ? { ...w, enabled } : w));
    try {
      await fetch(`${url}/api/config/widgets`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [widgetId]: { enabled } }),
      });
    } catch { /* */ }
  };

  const flash = (msg: string) => {
    setStatus(msg);
    setTimeout(() => setStatus(""), 2500);
  };

  return (
    <div className="page-content">
      <h1 className="text-[20px] font-600 text-t-primary mb-6 animate-in">Control</h1>

      {status && (
        <div className="mb-4 px-4 py-2.5 rounded-xl text-[13px] font-medium animate-in"
          style={{ background: "var(--color-amber-dim)", color: "var(--color-amber)" }}>
          {status}
        </div>
      )}

      {/* Layout Presets */}
      <section className="mb-8 animate-in stagger-1">
        <h2 className="text-[13px] font-600 text-t-secondary uppercase tracking-wider mb-3">Layout</h2>
        <div className="flex flex-wrap gap-2">
          {LAYOUT_PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => applyPreset(p.id)}
              className="pill"
              data-active={preset === p.id ? "true" : "false"}
            >
              {p.label}
            </button>
          ))}
        </div>
      </section>

      {/* Widgets */}
      <section className="animate-in stagger-2">
        <h2 className="text-[13px] font-600 text-t-secondary uppercase tracking-wider mb-3">Widgets</h2>
        <div className="card !p-0 divide-y divide-[rgba(255,255,255,0.04)]">
          {widgets.length === 0 ? (
            <p className="text-[13px] text-t-muted p-4">No widgets loaded</p>
          ) : (
            widgets.map((w) => (
              <div key={w.id} className="flex items-center justify-between px-4 py-3.5">
                <span className="text-[14px] text-t-primary capitalize">
                  {w.id.replace(/_/g, " ")}
                </span>
                <button
                  className="toggle"
                  data-on={String(w.enabled)}
                  onClick={() => toggleWidget(w.id, !w.enabled)}
                />
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
