"use client";

import { useState } from "react";
import { useDashboard } from "@/components/DashboardProvider";
import { TVMirror } from "@/components/TVMirror";
import { GridEditor } from "@/components/GridEditor";
import { PresetSelector } from "@/components/PresetSelector";

export default function DashboardPage() {
  const { connected, layout, activePreset } = useDashboard();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="page-shell">
      {/* Status bar */}
      <div className="status-bar">
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 600, color: "var(--color-t-primary)" }}>
            Command Center
          </h1>
          <p style={{ fontSize: 11, color: "var(--color-t-muted)", marginTop: 2 }}>
            {layout.length} widget{layout.length !== 1 ? "s" : ""} active
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            className="status-dot"
            style={{ background: connected ? "#00E676" : "#FF5252" }}
          />
          <span style={{ fontSize: 11, fontWeight: 500, color: connected ? "#00E676" : "#FF5252" }}>
            {connected ? "Live" : "Offline"}
          </span>
        </div>
      </div>

      {/* Preset selector */}
      <PresetSelector />

      {/* Flip container */}
      <div className="flip-container animate-in">
        <div className={`flip-inner ${isEditing ? "flipped" : ""}`}>
          {/* Front — TV Mirror */}
          <div className="flip-front">
            <TVMirror />
          </div>
          {/* Back — Grid Editor */}
          <div className="flip-back">
            <GridEditor onDone={() => setIsEditing(false)} />
          </div>
        </div>
      </div>

      {/* FAB — edit/save toggle */}
      <button
        className={`fab ${isEditing ? "editing" : ""}`}
        onClick={() => setIsEditing(!isEditing)}
        aria-label={isEditing ? "Done editing" : "Edit layout"}
      >
        {isEditing ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
          </svg>
        )}
      </button>
    </div>
  );
}
