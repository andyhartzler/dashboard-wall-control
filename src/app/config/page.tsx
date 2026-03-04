"use client";

import { useState, useEffect, useCallback } from "react";
import { useDashboard } from "@/components/DashboardProvider";
import { ApiKeyForm } from "@/components/ApiKeyForm";
import { Save, Loader2, RotateCcw, Layout } from "lucide-react";

interface WidgetConfig {
  id: string;
  enabled: boolean;
  interval?: number;
  [key: string]: unknown;
}

export default function ConfigPage() {
  const { url } = useDashboard();

  // Layout presets
  const [presets] = useState<string[]>([
    "default",
    "minimal",
    "news_focus",
    "financial",
    "weather_focus",
  ]);
  const [selectedPreset, setSelectedPreset] = useState("default");
  const [presetLoading, setPresetLoading] = useState(false);
  const [presetStatus, setPresetStatus] = useState("");

  // Widget config
  const [widgets, setWidgets] = useState<WidgetConfig[]>([]);
  const [widgetsLoading, setWidgetsLoading] = useState(false);

  // Location
  const [location, setLocation] = useState({ lat: "", lon: "", city: "" });
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationStatus, setLocationStatus] = useState("");

  const fetchConfig = useCallback(async () => {
    if (!url) return;
    try {
      const res = await fetch(`${url}/api/config`);
      if (res.ok) {
        const data = await res.json();
        if (data.location) {
          setLocation({
            lat: String(data.location.lat || ""),
            lon: String(data.location.lon || ""),
            city: data.location.city || "",
          });
        }
        if (data.layout_preset) {
          setSelectedPreset(data.layout_preset);
        }
      }
    } catch {
      // Connection error
    }
  }, [url]);

  const fetchWidgets = useCallback(async () => {
    if (!url) return;
    setWidgetsLoading(true);
    try {
      const res = await fetch(`${url}/api/widgets`);
      if (res.ok) {
        const data = await res.json();
        setWidgets(
          Array.isArray(data)
            ? data
            : Object.entries(data).map(([id, cfg]) => ({
                id,
                ...(typeof cfg === "object" && cfg !== null ? cfg : {}),
                enabled: true,
              } as WidgetConfig))
        );
      }
    } catch {
      // Connection error
    }
    setWidgetsLoading(false);
  }, [url]);

  useEffect(() => {
    fetchConfig();
    fetchWidgets();
  }, [fetchConfig, fetchWidgets]);

  const applyPreset = async () => {
    if (!url) return;
    setPresetLoading(true);
    try {
      const res = await fetch(`${url}/api/layout/${selectedPreset}`, {
        method: "PUT",
      });
      setPresetStatus(res.ok ? "Layout applied" : "Failed to apply layout");
    } catch {
      setPresetStatus("Connection error");
    }
    setPresetLoading(false);
    setTimeout(() => setPresetStatus(""), 3000);
  };

  const saveLocation = async () => {
    if (!url) return;
    setLocationLoading(true);
    try {
      const res = await fetch(`${url}/api/config`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: {
            lat: parseFloat(location.lat) || 0,
            lon: parseFloat(location.lon) || 0,
            city: location.city,
          },
        }),
      });
      setLocationStatus(res.ok ? "Location saved" : "Failed to save");
    } catch {
      setLocationStatus("Connection error");
    }
    setLocationLoading(false);
    setTimeout(() => setLocationStatus(""), 3000);
  };

  const toggleWidget = async (widgetId: string, enabled: boolean) => {
    if (!url) return;
    try {
      await fetch(`${url}/api/config/widgets`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [widgetId]: { enabled } }),
      });
      setWidgets((prev) =>
        prev.map((w) => (w.id === widgetId ? { ...w, enabled } : w))
      );
    } catch {
      // Connection error
    }
  };

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-text-primary">
          Configuration
        </h2>
        <p className="text-sm text-text-muted mt-1">
          Manage your dashboard settings remotely
        </p>
      </div>

      {/* Layout Presets */}
      <section className="glass-panel relative p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Layout className="w-4 h-4 text-accent-blue" />
          <h3 className="text-sm font-medium text-text-primary">
            Layout Preset
          </h3>
        </div>

        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => (
            <button
              key={preset}
              onClick={() => setSelectedPreset(preset)}
              className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${
                selectedPreset === preset
                  ? "bg-accent-blue/15 border-accent-blue/30 text-accent-blue"
                  : "bg-transparent border-border-glass text-text-secondary hover:border-border-glass-hover"
              }`}
            >
              {preset.replace(/_/g, " ")}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={applyPreset}
            disabled={presetLoading}
            className="glass-btn flex items-center gap-1.5 text-xs"
          >
            {presetLoading ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Save className="w-3 h-3" />
            )}
            Apply Layout
          </button>
          {presetStatus && (
            <span className="text-xs text-accent-cyan">{presetStatus}</span>
          )}
        </div>
      </section>

      {/* Location Settings */}
      <section className="glass-panel relative p-6 space-y-4">
        <h3 className="text-sm font-medium text-text-primary">Location</h3>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-text-muted block mb-1.5">City</label>
            <input
              type="text"
              value={location.city}
              onChange={(e) =>
                setLocation((l) => ({ ...l, city: e.target.value }))
              }
              placeholder="Kansas City"
              className="glass-input"
            />
          </div>
          <div>
            <label className="text-xs text-text-muted block mb-1.5">
              Latitude
            </label>
            <input
              type="text"
              value={location.lat}
              onChange={(e) =>
                setLocation((l) => ({ ...l, lat: e.target.value }))
              }
              placeholder="39.0997"
              className="glass-input"
            />
          </div>
          <div>
            <label className="text-xs text-text-muted block mb-1.5">
              Longitude
            </label>
            <input
              type="text"
              value={location.lon}
              onChange={(e) =>
                setLocation((l) => ({ ...l, lon: e.target.value }))
              }
              placeholder="-94.5786"
              className="glass-input"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={saveLocation}
            disabled={locationLoading}
            className="glass-btn flex items-center gap-1.5 text-xs"
          >
            {locationLoading ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Save className="w-3 h-3" />
            )}
            Save Location
          </button>
          {locationStatus && (
            <span className="text-xs text-accent-cyan">{locationStatus}</span>
          )}
        </div>
      </section>

      {/* Widget Configuration */}
      <section className="glass-panel relative p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-text-primary">Widgets</h3>
          <button
            onClick={fetchWidgets}
            disabled={widgetsLoading}
            className="p-1.5 rounded-lg hover:bg-white/[0.05] transition-colors"
          >
            <RotateCcw
              className={`w-3.5 h-3.5 text-text-muted ${
                widgetsLoading ? "animate-spin" : ""
              }`}
            />
          </button>
        </div>

        {widgets.length === 0 ? (
          <p className="text-xs text-text-muted">
            {url
              ? "No widgets found. Connect to the backend and refresh."
              : "Connect to backend to view widgets."}
          </p>
        ) : (
          <div className="space-y-2">
            {widgets.map((widget) => (
              <div
                key={widget.id}
                className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/[0.02] border border-border-glass"
              >
                <span className="text-xs text-text-secondary">
                  {widget.id.replace(/_/g, " ")}
                </span>
                <button
                  onClick={() => toggleWidget(widget.id, !widget.enabled)}
                  className={`relative w-9 h-5 rounded-full transition-colors ${
                    widget.enabled
                      ? "bg-accent-green/30"
                      : "bg-white/[0.08]"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${
                      widget.enabled
                        ? "left-[18px] bg-accent-green"
                        : "left-0.5 bg-text-muted"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* API Keys */}
      <section className="glass-panel relative p-6">
        <ApiKeyForm backendUrl={url} />
      </section>
    </div>
  );
}
