"use client";

import { useState, useEffect, useCallback } from "react";
import { useDashboard } from "./DashboardProvider";

interface WMConfig {
  view: string;
  zoom: number;
  lat: number;
  lon: number;
  layers: string;
  timeRange: string;
}

const DEFAULT_CONFIG: WMConfig = {
  view: "global",
  zoom: 2.5,
  lat: 20,
  lon: 0,
  layers: "conflicts,hotspots,protests,ucdpEvents,displacement,bases,nuclear,flights,military,gpsJamming,datacenters,spaceports,minerals,ais,waterways,weather,fires,natural,climate,economic,sanctions,outages,cyberThreats",
  timeRange: "24h",
};

const REGIONS = [
  { id: "global", label: "Global" },
  { id: "america", label: "Americas" },
  { id: "eu", label: "Europe" },
  { id: "mena", label: "MENA" },
  { id: "asia", label: "Asia" },
  { id: "latam", label: "LatAm" },
  { id: "africa", label: "Africa" },
  { id: "oceania", label: "Oceania" },
];

const TIME_RANGES = ["1h", "6h", "24h", "48h", "7d", "all"];

const LAYER_GROUPS: { label: string; layers: { id: string; label: string }[] }[] = [
  {
    label: "Intelligence",
    layers: [
      { id: "conflicts", label: "Conflicts" },
      { id: "hotspots", label: "Hotspots" },
      { id: "protests", label: "Protests" },
      { id: "ucdpEvents", label: "UCDP" },
      { id: "displacement", label: "Displaced" },
    ],
  },
  {
    label: "Military",
    layers: [
      { id: "bases", label: "Bases" },
      { id: "nuclear", label: "Nuclear" },
      { id: "flights", label: "Flights" },
      { id: "military", label: "Military" },
      { id: "gpsJamming", label: "GPS Jam" },
    ],
  },
  {
    label: "Infrastructure",
    layers: [
      { id: "cables", label: "Cables" },
      { id: "pipelines", label: "Pipelines" },
      { id: "datacenters", label: "Data Ctrs" },
      { id: "spaceports", label: "Space" },
      { id: "minerals", label: "Minerals" },
    ],
  },
  {
    label: "Maritime",
    layers: [
      { id: "ais", label: "Ships" },
      { id: "waterways", label: "Waterways" },
    ],
  },
  {
    label: "Environment",
    layers: [
      { id: "weather", label: "Weather" },
      { id: "fires", label: "Fires" },
      { id: "natural", label: "Natural" },
      { id: "climate", label: "Climate" },
    ],
  },
  {
    label: "Cyber & Econ",
    layers: [
      { id: "economic", label: "Economic" },
      { id: "sanctions", label: "Sanctions" },
      { id: "outages", label: "Outages" },
      { id: "cyberThreats", label: "Cyber" },
    ],
  },
];

const PRESETS: { id: string; label: string; layers: string }[] = [
  { id: "military", label: "Military", layers: "bases,nuclear,flights,military,waterways" },
  { id: "intel", label: "Intel", layers: "conflicts,hotspots,protests,ucdpEvents,displacement" },
  { id: "infra", label: "Infra", layers: "cables,pipelines,datacenters,spaceports,minerals" },
  { id: "minimal", label: "Minimal", layers: "conflicts,hotspots" },
  { id: "all", label: "All", layers: LAYER_GROUPS.flatMap(g => g.layers.map(l => l.id)).join(",") },
  { id: "none", label: "None", layers: "none" },
];

export function WorldMonitorPanel() {
  const { url, password } = useDashboard();
  const [config, setConfig] = useState<WMConfig>(DEFAULT_CONFIG);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "x-dashboard-password": password,
    "ngrok-skip-browser-warning": "1",
  };

  const fetchConfig = useCallback(async () => {
    if (!url) return;
    try {
      const resp = await fetch(`${url}/api/kiosk/worldmonitor-config`, { headers });
      if (resp.ok) {
        const data = await resp.json();
        setConfig(data);
      }
    } catch {
      // use defaults
    }
    setLoaded(true);
  }, [url]);

  useEffect(() => { fetchConfig(); }, [fetchConfig]);

  const activeLayers = new Set(
    (config.layers || "").split(",").filter(Boolean).filter(l => l !== "none")
  );

  const toggleLayer = (layerId: string) => {
    const next = new Set(activeLayers);
    if (next.has(layerId)) {
      next.delete(layerId);
    } else {
      next.add(layerId);
    }
    setConfig({ ...config, layers: next.size > 0 ? Array.from(next).join(",") : "none" });
  };

  const applyPreset = (layers: string) => {
    setConfig({ ...config, layers });
  };

  const applyConfig = async () => {
    if (!url || saving) return;
    setSaving(true);
    try {
      await fetch(`${url}/api/kiosk/worldmonitor-config`, {
        method: "PUT",
        headers,
        body: JSON.stringify(config),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // silent fail
    }
    setSaving(false);
  };

  if (!loaded) {
    return (
      <div style={{ textAlign: "center", padding: 40 }}>
        <span style={{ fontSize: 12, color: "var(--color-t-muted)" }}>Loading world monitor...</span>
      </div>
    );
  }

  const activeLayerCount = activeLayers.size;
  const regionLabel = REGIONS.find(r => r.id === config.view)?.label || config.view;

  return (
    <div className="animate-in" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Config summary */}
      <div style={{
        padding: "16px 18px",
        borderRadius: 12,
        border: "1px solid var(--color-glass-border)",
        background: "var(--color-surface-0)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--color-t-primary)" }}>
            {regionLabel} View
          </span>
          <span style={{ fontSize: 11, color: "var(--color-t-muted)" }}>
            {activeLayerCount} layer{activeLayerCount !== 1 ? "s" : ""} active &middot; {config.timeRange} window
          </span>
        </div>
        <span className="glass-badge" style={{
          fontSize: 9,
          fontWeight: 600,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "var(--color-accent-green)",
        }}>
          ON TV
        </span>
      </div>

      {/* Region selector */}
      <Section label="Region">
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {REGIONS.map(r => (
            <Pill
              key={r.id}
              label={r.label}
              active={config.view === r.id}
              onClick={() => setConfig({ ...config, view: r.id })}
            />
          ))}
        </div>
      </Section>

      {/* Time range */}
      <Section label="Time Range">
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {TIME_RANGES.map(t => (
            <Pill
              key={t}
              label={t}
              active={config.timeRange === t}
              onClick={() => setConfig({ ...config, timeRange: t })}
            />
          ))}
        </div>
      </Section>

      {/* Quick presets */}
      <Section label="Layer Presets">
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {PRESETS.map(p => (
            <Pill
              key={p.id}
              label={p.label}
              active={config.layers === p.layers}
              accent="var(--color-accent-orange)"
              onClick={() => applyPreset(p.layers)}
            />
          ))}
        </div>
      </Section>

      {/* Layer toggles */}
      {LAYER_GROUPS.map(group => (
        <Section key={group.label} label={group.label}>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            {group.layers.map(layer => (
              <Chip
                key={layer.id}
                label={layer.label}
                active={activeLayers.has(layer.id)}
                onClick={() => toggleLayer(layer.id)}
              />
            ))}
          </div>
        </Section>
      ))}

      {/* Apply button */}
      <button
        onClick={applyConfig}
        disabled={saving}
        style={{
          width: "100%",
          padding: "14px 0",
          borderRadius: 12,
          border: saved
            ? "1px solid rgba(0, 230, 118, 0.3)"
            : "1px solid rgba(100, 180, 255, 0.3)",
          background: saved
            ? "rgba(0, 230, 118, 0.12)"
            : "rgba(100, 180, 255, 0.1)",
          color: saved ? "#00E676" : "#4C9FFF",
          fontSize: 14,
          fontWeight: 600,
          fontFamily: "inherit",
          cursor: saving ? "wait" : "pointer",
          transition: "all 0.2s ease",
          letterSpacing: "0.02em",
        }}
      >
        {saving ? "Applying..." : saved ? "Applied to TV" : "Apply to TV"}
      </button>
    </div>
  );
}

/* === Shared sub-components === */

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{
        fontSize: 10,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.12em",
        color: "var(--color-t-muted)",
        marginBottom: 8,
      }}>
        {label}
      </div>
      {children}
    </div>
  );
}

function Pill({
  label, active, accent, onClick,
}: {
  label: string;
  active: boolean;
  accent?: string;
  onClick: () => void;
}) {
  const activeColor = accent || "rgba(100, 180, 255, 1)";
  return (
    <button
      onClick={onClick}
      style={{
        padding: "6px 14px",
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 500,
        fontFamily: "inherit",
        border: active
          ? `1px solid ${accent || "rgba(100, 180, 255, 0.3)"}`
          : "1px solid var(--color-glass-border)",
        background: active
          ? `${accent || "rgba(100, 180, 255, 0.12)"}`.replace("1)", "0.12)")
          : "var(--color-surface-0)",
        color: active ? activeColor : "var(--color-t-secondary)",
        cursor: "pointer",
        transition: "all 0.2s ease",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );
}

function Chip({
  label, active, onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "5px 10px",
        borderRadius: 8,
        fontSize: 11,
        fontWeight: 500,
        fontFamily: "inherit",
        border: active
          ? "1px solid rgba(0, 230, 118, 0.3)"
          : "1px solid var(--color-glass-border)",
        background: active
          ? "rgba(0, 230, 118, 0.1)"
          : "var(--color-surface-0)",
        color: active ? "#00E676" : "var(--color-t-muted)",
        cursor: "pointer",
        transition: "all 0.15s ease",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );
}
