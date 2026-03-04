"use client";

import { useState, useEffect } from "react";
import { useDashboard } from "@/components/DashboardProvider";

interface PresetInfo {
  key: string;
  name: string;
  widget_count: number;
}

export function PresetSelector() {
  const { url, password, activePreset, switchPreset } = useDashboard();
  const [presets, setPresets] = useState<PresetInfo[]>([]);
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState("");

  const authHeaders: HeadersInit = {
    "Content-Type": "application/json",
    "x-dashboard-password": password,
    "ngrok-skip-browser-warning": "1",
  };

  useEffect(() => {
    if (!url) return;
    fetch(`${url}/api/layout/presets`, { headers: authHeaders })
      .then((r) => r.json())
      .then((d) => setPresets(d.presets || []))
      .catch(() => {});
  }, [url, activePreset]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCreate = async () => {
    if (!newName.trim()) return;
    const key = newName.trim().toLowerCase().replace(/\s+/g, "_");
    await fetch(`${url}/api/layout/${key}`, {
      method: "PUT",
      headers: authHeaders,
      body: JSON.stringify({ name: newName.trim(), widgets: [] }),
    });
    await switchPreset(key);
    setShowNew(false);
    setNewName("");
    const r = await fetch(`${url}/api/layout/presets`, { headers: authHeaders });
    const d = await r.json();
    setPresets(d.presets || []);
  };

  return (
    <div className="preset-row">
      {presets.map((p) => (
        <button
          key={p.key}
          className={`preset-pill ${p.key === activePreset ? "active" : ""}`}
          onClick={() => switchPreset(p.key)}
        >
          {p.name || p.key}
          <span style={{ marginLeft: 4, opacity: 0.5, fontSize: 10 }}>
            {p.widget_count}
          </span>
        </button>
      ))}
      {showNew ? (
        <form
          onSubmit={(e) => { e.preventDefault(); handleCreate(); }}
          style={{ display: "flex", gap: 4, alignItems: "center" }}
        >
          <input
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Name..."
            style={{
              width: 100,
              padding: "5px 10px",
              fontSize: 12,
              borderRadius: 20,
              border: "1px solid var(--color-glass-border)",
              background: "var(--color-surface-0)",
              color: "var(--color-t-primary)",
              fontFamily: "inherit",
              outline: "none",
            }}
          />
          <button
            type="submit"
            className="preset-pill active"
            style={{ padding: "5px 10px", fontSize: 11 }}
          >
            Add
          </button>
          <button
            type="button"
            className="preset-pill"
            style={{ padding: "5px 10px", fontSize: 11 }}
            onClick={() => { setShowNew(false); setNewName(""); }}
          >
            ✕
          </button>
        </form>
      ) : (
        <button
          className="preset-pill add-new"
          onClick={() => setShowNew(true)}
        >
          + New
        </button>
      )}
    </div>
  );
}
